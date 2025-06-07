---
layout: post
title: "JSON Trouble on the Default-lines"
date: 2026-06-07
authors:
  - name: Delano
    to: https://blog.onetimesecret.com/about
    avatar:
      src: /img/portrait-profile-pic-delano-2025-m.png
image:
  src: /img/blog/2025/20250607-curious-json-concept4.svg
badge:
  label: Engineering
readingTime: 7
---

_Note: I leaned heavily on Google Gemini for this investigation, blog post, and the necessary blog post illustration._

We've been refining our configuration system using JSON schemas as the source of truth. The goal: let users provide a sparse `config.yaml` and have our application fill in all the defaults automatically. What we discovered about how different languages handle JSON Schema defaults was illuminating.

## The Expectation

The main library we're using is the `json_schemer` gem with its `insert_property_defaults: true` option. We considered the more popular `json-schema` gem (500+ million downloads vs `json_schemer`'s 80 million), but it's stuck on JSON Schema draft-05 and [no longer actively maintained](https://github.com/voxpupuli/json-schema/issues/423). Multiple GitHub issues confirm draft-06+ support remains incomplete despite years of requests.

We expected `json_schemer` would take our JSON schema (complete with `default` keywords) and minimal user config, then produce a fully populated configuration hash. e.g. if our schema defined a `site` section with `host` defaulting to `"localhost:3000"`, even an empty user config should result in `site: { host: "localhost:3000", ... }`.

## The Problem

Simple top-level defaults worked. Defaults within existing, valid config sections worked. But the deeper "scaffolding" – creating missing nested objects and filling their defaults – didn't happen comprehensively.

The issue: interaction between `default: {}` (indicating an object should be created if missing) and the `required` keyword. If an object was created (e.g., `site: {}`) but immediately failed validation due to missing required properties, `json_schemer` halted default-filling for properties within that invalid object.

## The Experiment

To determine if this was `json_schemer`-specific, we tested across three environments:

1. **Ruby** with `json_schemer`
2. **Node.js** with `ajv`
3. **Python** with `jsonschema`

Test schema structure: nested objects with `default: {}` and `required` fields at multiple levels.

```json
{
  "type": "object",
  "properties": {
    "config_section": {
      "type": "object",
      "default": {},
      "properties": {
        "setting1_with_default": { "type": "string", "default": "default_for_setting1" },
        "setting2_required_no_default": { "type": "boolean" },
        "nested_object": {
          "type": "object",
          "default": {},
          "properties": {
            "deep_setting_with_default": { "type": "integer", "default": 42 },
            "deep_setting_required_no_default": { "type": "string" }
          },
          "required": ["deep_setting_required_no_default"]
        }
      },
      "required": ["setting2_required_no_default", "nested_object"]
    },
    "top_level_prop_with_default": {
      "type": "string",
      "default": "default_for_top_level"
    }
  }
}
```

### Ruby Results

With empty input:

```
Data AFTER validation:
{"config_section" => {}, "top_level_prop_with_default" => "default_for_top_level"}

Validation FAILED. Errors:
  1. Path: /config_section, Error: required, Details: {"missing_keys" => ["setting2_required_no_default", "nested_object"]}
```

`config_section` was created as `{}`, but `setting1_with_default` and `deep_setting_with_default` were not applied. The `required` failure stopped the cascade.

### Node.js Results

`ajv` with `useDefaults: true` behaved differently:

```javascript
Data AFTER validation:
{
  config_section: {
    setting1_with_default: 'default_for_setting1', // Applied!
    nested_object: { deep_setting_with_default: 42 }    // Applied!
  },
  top_level_prop_with_default: 'default_for_top_level'
}

Validation FAILED. Errors: [required field errors]
```

`ajv` scaffolded the nested structure with defaults first, then reported validation errors.

### Python Results

With custom validator extension, Python mirrored `ajv`'s behavior: defaults applied before `required` errors were flagged.

## The Difference

**`json_schemer`:** Validates `required` constraints before filling defaults within invalid objects.

**`ajv` / Python:** Apply defaults globally first, then validate.

Both approaches are valid per the JSON Schema specification, but `json_schemer`'s behavior meant our strategy wouldn't work.

## Our Solution

We're adopting a "Deep Merge" strategy:

1. **Generate Full Defaults:** Traverse our schema to build a complete Ruby hash with all defaults applied
2. **Load User Config:** Read the sparse `config.yaml`
3. **Deep Merge:** User settings override defaults, but all defaults are present
4. **Validate:** Pass the complete hash to `json_schemer` for type/format/constraint validation

This ensures predictable, fully defaulted configuration regardless of how sparse the user's input is.

---

### Appendix: Test Scripts



For those interested in replicating these tests, here are the test scripts.

**Ruby (`json_schemer_test.rb`):**

::CollapsibleContent{summary="Ruby Test Script"}

```ruby
# json_schemer_test.rb
require 'json'
require 'json_schemer'
require 'pp' # For pretty printing hashes

# --- Minimal Schema Definition ---
# This schema mimics the structure causing issues:
# - A top-level object.
# - A property ('config_section') that is an object and has "default: {}".
#   - This 'config_section' has its own properties with defaults and some required properties.
#   - One of its properties ('nested_object') is also an object with "default: {}"
#     and its own defaults and required properties.
minimal_schema = {
  "type" => "object",
  "properties" => {
    "config_section" => {
      "type" => "object",
      "default" => {}, # Key: Should create config_section = {} if missing
      "properties" => {
        "setting1_with_default" => { "type" => "string", "default" => "default_for_setting1" },
        "setting2_required_no_default" => { "type" => "boolean" },
        "nested_object" => {
          "type" => "object",
          "default" => {}, # Key: Should create nested_object = {} if missing
          "properties" => {
            "deep_setting_with_default" => { "type" => "integer", "default" => 42 },
            "deep_setting_required_no_default" => { "type" => "string" }
          },
          # 'deep_setting_with_default' is NOT required here to see if its default applies
          # when 'nested_object' is created.
          # Let's make 'deep_setting_required_no_default' required to see validation errors.
          "required" => ["deep_setting_required_no_default"]
        }
      },
      "required" => ["setting2_required_no_default", "nested_object"]
    },
    "top_level_prop_with_default" => {
      "type" => "string",
      "default" => "default_for_top_level"
    }
  }
}

puts "--- Schema Being Used ---"
pp minimal_schema
puts "-------------------------"

# --- Test Scenarios ---

test_scenarios = [
  {
    description: "1. Completely empty input data",
    data: {}
  },
  {
    description: "2. Input data with 'config_section' partially defined (string keys)",
    data: {
      "config_section" => {
        "setting1_with_default" => "custom_value_for_setting1"
        # 'setting2_required_no_default' is missing
        # 'nested_object' is missing
      }
    }
  },
  {
    description: "3. Input data with 'config_section' and 'nested_object' defined, satisfying some requirements (string keys)",
    data: {
      "config_section" => {
        "setting2_required_no_default" => true,
        "nested_object" => {
          "deep_setting_required_no_default" => "custom_deep_value"
          # 'deep_setting_with_default' is missing
        }
      }
      # 'top_level_prop_with_default' is missing
    }
  },
  {
    description: "4. Input data with 'config_section' but 'nested_object' is an empty hash (string keys)",
    data: {
      "config_section" => {
        "setting2_required_no_default" => true,
        "nested_object" => {} # Empty nested object
      }
    }
  }
]

schemer = JSONSchemer.schema(
  minimal_schema,
  insert_property_defaults: true
)

test_scenarios.each_with_index do |scenario, index|
  puts "\n--- Scenario: #{scenario[:description]} ---"
  data_to_validate = JSON.parse(scenario[:data].to_json) # Deep copy with string keys

  puts "Data BEFORE validation:"
  pp data_to_validate

  errors = schemer.validate(data_to_validate).to_a

  puts "\nData AFTER validation:"
  pp data_to_validate

  if errors.empty?
    puts "\nValidation PASSED."
  else
    puts "\nValidation FAILED. Errors:"
    errors.each_with_index do |err, err_idx|
      puts "  #{err_idx + 1}. Path: #{err['data_pointer']}, Error: #{err['type']}, Details: #{err['details'] || err['error']}"
    end
  end
  puts "------------------------------------"
end

puts "\nTest script finished."
```

::


**Node.js (`ajv_test.js`):**

::CollapsibleContent{summary="Node.js Test Script"}

```javascript
// ajv_test.js
import Ajv from "ajv";
import util from "util"; // For deep logging objects

// Deep copy utility for objects/arrays
function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

const minimalSchema = {
  type: "object",
  properties: {
    config_section: {
      type: "object",
      default: {},
      properties: {
        setting1_with_default: { type: "string", default: "default_for_setting1" },
        setting2_required_no_default: { type: "boolean" },
        nested_object: {
          type: "object",
          default: {},
          properties: {
            deep_setting_with_default: { type: "number", default: 42 }, // Changed to number to match Ruby's integer
            deep_setting_required_no_default: { type: "string" }
          },
          required: ["deep_setting_required_no_default"]
        }
      },
      required: ["setting2_required_no_default", "nested_object"]
    },
    top_level_prop_with_default: {
      type: "string",
      default: "default_for_top_level"
    }
  }
};

console.log("--- Schema Being Used ---");
console.log(util.inspect(minimalSchema, { depth: null, colors: true }));
console.log("-------------------------");

const testScenarios = [
  {
    description: "1. Completely empty input data",
    data: {}
  },
  {
    description: "2. Input data with 'config_section' partially defined (string keys)",
    data: {
      config_section: {
        setting1_with_default: "custom_value_for_setting1"
      }
    }
  },
  {
    description: "3. Input data with 'config_section' and 'nested_object' defined, satisfying some requirements (string keys)",
    data: {
      config_section: {
        setting2_required_no_default: true,
        nested_object: {
          deep_setting_required_no_default: "custom_deep_value"
        }
      }
    }
  },
  {
    description: "4. Input data with 'config_section' but 'nested_object' is an empty hash (string keys)",
    data: {
      config_section: {
        setting2_required_no_default: true,
        nested_object: {}
      }
    }
  }
];

const ajv = new Ajv({ useDefaults: true, allErrors: true });

testScenarios.forEach((scenario) => {
  console.log(`\n--- Scenario: ${scenario.description} ---`);
  let dataToValidate = deepCopy(scenario.data); 

  console.log("Data BEFORE validation:");
  console.log(util.inspect(dataToValidate, { depth: null, colors: true }));

  const validate = ajv.compile(minimalSchema);
  const isValid = validate(dataToValidate);

  console.log("\nData AFTER validation:");
  console.log(util.inspect(dataToValidate, { depth: null, colors: true }));

  if (isValid) {
    console.log("\nValidation PASSED.");
  } else {
    console.log("\nValidation FAILED. Errors:");
    (validate.errors || []).forEach((err, errIdx) => {
      console.log(`  ${errIdx + 1}. Path: ${err.instancePath}, Keyword: ${err.keyword}, Message: ${err.message}, Params: ${util.inspect(err.params)}`);
    });
  }
  console.log("------------------------------------");
});

console.log("\nTest script finished.");


```

::


**Python (`python_jsonschema_test.py`):**

::CollapsibleContent{summary="Python Test Script"}

```python
# python_jsonschema_test.py
import json
import copy
from jsonschema import Draft7Validator, validators, exceptions

def extend_with_default(validator_class):
    validate_properties = validator_class.VALIDATORS["properties"]

    def set_defaults_for_properties(validator, properties, instance, schema):
        if isinstance(instance, dict): # Only apply to objects
            for property_name, subschema in properties.items():
                if "default" in subschema:
                    instance.setdefault(property_name, copy.deepcopy(subschema["default"]))
        
        # Continue with original 'properties' validation
        yield from validate_properties(validator, properties, instance, schema)

    # This handles defaults for properties *within* an object.
    # For defaults of the main object itself (if type:object and has "default":{}),
    # it's a bit more complex with this extension method.
    return validators.extend(validator_class, {"properties": set_defaults_for_properties})

DefaultFillingValidator = extend_with_default(Draft7Validator)

minimal_schema = {
  "type": "object",
  "properties": {
    "config_section": {
      "type": "object",
      "default": {}, 
      "properties": {
        "setting1_with_default": { "type": "string", "default": "default_for_setting1" },
        "setting2_required_no_default": { "type": "boolean" },
        "nested_object": {
          "type": "object",
          "default": {}, 
          "properties": {
            "deep_setting_with_default": { "type": "integer", "default": 42 },
            "deep_setting_required_no_default": { "type": "string" }
          },
          "required": ["deep_setting_required_no_default"]
        }
      },
      "required": ["setting2_required_no_default", "nested_object"]
    },
    "top_level_prop_with_default": {
      "type": "string",
      "default": "default_for_top_level"
    }
  }
}

print("--- Schema Being Used ---")
print(json.dumps(minimal_schema, indent=2))
print("-------------------------")

test_scenarios = [
  {
    "description": "1. Completely empty input data",
    "data": {}
  },
  {
    "description": "2. Input data with 'config_section' partially defined (string keys)",
    "data": {
      "config_section": {
        "setting1_with_default": "custom_value_for_setting1"
      }
    }
  },
  {
    "description": "3. Input data with 'config_section' and 'nested_object' defined, satisfying some requirements (string keys)",
    "data": {
      "config_section": {
        "setting2_required_no_default": True,
        "nested_object": {
          "deep_setting_required_no_default": "custom_deep_value"
        }
      }
    }
  },
  {
    "description": "4. Input data with 'config_section' but 'nested_object' is an empty hash (string keys)",
    "data": {
      "config_section": {
        "setting2_required_no_default": True,
        "nested_object": {} 
      }
    }
  }
]

for scenario in test_scenarios:
    print(f"\n--- Scenario: {scenario['description']} ---")
    data_to_validate = copy.deepcopy(scenario["data"])

    print("Data BEFORE validation:")
    print(json.dumps(data_to_validate, indent=2))

    # Manually apply top-level defaults for the root object if it's empty
    # This is because our extended validator focuses on 'properties' within an object.
    if not data_to_validate and minimal_schema.get("type") == "object" and "properties" in minimal_schema:
        for prop, prop_schema in minimal_schema["properties"].items():
            if "default" in prop_schema:
                data_to_validate.setdefault(prop, copy.deepcopy(prop_schema["default"]))
    
    validator_instance = DefaultFillingValidator(minimal_schema)
    
    collected_errors = []
    for error in sorted(validator_instance.iter_errors(data_to_validate), key=str):
        collected_errors.append(error)

    print("\nData AFTER validation (and default filling attempt):")
    print(json.dumps(data_to_validate, indent=2))

    if not collected_errors:
        print("\nValidation PASSED (according to DefaultFillingValidator).")
    else:
        print("\nValidation FAILED (according to DefaultFillingValidator). Errors:")
        for i, err in enumerate(collected_errors):
            print(f"  {i + 1}. Path: {list(err.path)}, Message: {err.message}, Validator: {err.validator}")
    print("------------------------------------")

print("\nTest script finished.")


```

::
