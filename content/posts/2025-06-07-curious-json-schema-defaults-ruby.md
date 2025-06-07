---
layout: post
title: "The Curious Case of JSON Schema Defaults: A Multi-Language Adventure"
date: 2026-06-07
authors:
  - name: Delano
    to: https://blog.onetimesecret.com/about
    avatar:
      src: /img/portrait-profile-pic-delano-2025-m.png
image:
  src: /img/blog/2025/20250607-curious-json-concept1.svg
badge:
  label: Engineering
readingTime: 7
---

Here at the Onetime Secret Compound, we're always tinkering under the hood, refining our systems, and occasionally, diving headfirst into rabbit holes that are deeper than they first appear. We've been spending time on our configuration system, aiming for a more robust and maintainable setup using JSON schemas as the source of truth. The goal? Allow for a sparse `config.yaml` from the user, and have our application intelligently fill in all the blanks with predefined defaults. Sounds simple, right? Well, as is often the case, the devil was in the details, specifically with how the Ruby JSON Schema validator, `json_schemer`, handles default values.

## The Expectation: Defaults All The Way Down

Our main tool for this in Ruby is the `json_schemer` gem. It has a handy option, `insert_property_defaults: true`, which we expected would take our JSON schema (complete with `default` keywords at various levels) and our minimal user-provided config, and automagically produce a fully populated configuration hash.

For instance, if our schema said the `site` section should exist, and within `site`, `host` should default to `"localhost:3000"`, we hoped that even an empty user config would result in `site: { host: "localhost:3000", ... }`.

## The Initial Puzzle: Defaults Playing Hide and Seek

What we observed was a bit more nuanced. While simple top-level defaults were applied, and defaults within *already existing and valid* sections of the config were filled, the deeper "scaffolding" – creating missing nested objects and then filling *their* defaults – wasn't happening as comprehensively as we'd hoped.

The main culprit seemed to be the interaction between the `default: {}` keyword (which we used to indicate an object should be created if missing) and the `required` keyword. If an object was created (e.g., `site: {}`) but immediately failed validation because it was missing its own `required` properties (like `site` requiring an `authentication` object), `json_schemer` appeared to halt the default-filling process for any properties *within* that now-invalid `site` object. No `site.host` default, no creation of `site.authentication` from its own `default: {}` definition, and so on.

## The Experiment: A Tri-Language Default Showdown

To understand if this behavior was specific to `json_schemer` or a more general characteristic of JSON Schema validation, we decided to set up a minimal test case and run it across three different environments:

1.  **Ruby** with `json_schemer`
2.  **Node.js** with `ajv` (a popular and often reference JSON Schema validator)
3.  **Python** with the `jsonschema` library

The minimal schema was designed to mimic our problematic structure: a top-level object with a nested `config_section` (itself having a `default: {}` and `required` fields), which in turn contained a `nested_object` (also with `default: {}` and `required` fields).

Here's the core of the schema (full scripts below):

```json
{
  "type": "object",
  "properties": {
    "config_section": {
      "type": "object",
      "default": {}, // Should create config_section = {} if missing
      "properties": {
        "setting1_with_default": { "type": "string", "default": "default_for_setting1" },
        "setting2_required_no_default": { "type": "boolean" },
        "nested_object": {
          "type": "object",
          "default": {}, // Should create nested_object = {} if missing
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

We then threw four scenarios at it, ranging from a completely empty input `{}` to more complete inputs.

### Ruby (`json_schemer`) Results

The Ruby script confirmed our initial observations. When the input was empty (Scenario 1):

```
# Scenario 1: Completely empty input data (Ruby)
Data AFTER validation:
{"config_section" => {}, "top_level_prop_with_default" => "default_for_top_level"}

Validation FAILED. Errors:
  1. Path: /config_section, Error: required, Details: {"missing_keys" => ["setting2_required_no_default", "nested_object"]}
```
Notice how `config_section` was created as `{}`, but `setting1_with_default` (inside `config_section`) and `deep_setting_with_default` (inside `config_section.nested_object`) were *not* applied. The `required` failure on `config_section` stopped the cascade.

### Node.js (`ajv`) Results

`ajv` (with `useDefaults: true`) behaved differently. For the same empty input (Scenario 1):

```javascript
// Scenario 1: Completely empty input data (Node.js with ajv)
Data AFTER validation:
{
  config_section: {
    setting1_with_default: 'default_for_setting1', // Applied!
    nested_object: { deep_setting_with_default: 42 }    // Applied!
  },
  top_level_prop_with_default: 'default_for_top_level'
}

Validation FAILED. Errors:
  1. Path: /config_section, Keyword: required, Message: must have required property 'setting2_required_no_default', ...
  2. Path: /config_section/nested_object, Keyword: required, Message: must have required property 'deep_setting_required_no_default', ...
```
`ajv` was more "eager." It scaffolded out the nested structure with defaults *first*, and *then* reported the `required` validation errors. This is often the behavior one might intuitively expect.

### Python (`jsonschema`) Results

The Python `jsonschema` library requires a bit more manual setup for default filling. With a custom validator extension, its behavior mirrored `ajv`'s: defaults were applied more deeply before `required` errors were flagged.

```python
# Scenario 1: Completely empty input data (Python with custom default filler)
Data AFTER validation (and default filling attempt):
{
  "config_section": {
    "setting1_with_default": "default_for_setting1", # Applied!
    "nested_object": {
      "deep_setting_with_default": 42                # Applied!
    }
  },
  "top_level_prop_with_default": "default_for_top_level"
}

Validation FAILED ... Errors: ...
```

## Understanding the Divergence

The key difference seems to be the operational order:
*   **`json_schemer` (Ruby):** Appears to validate `required` constraints on an object more strictly *before* attempting to fill defaults for properties within that object if the object itself is initially invalid due to missing required children.
*   **`ajv` (Node.js) / Python (with custom handling):** Tend to apply defaults more globally throughout the structure first, and then perform validation checks like `required`.

It's worth noting that the JSON Schema specification allows for some flexibility in implementation details, so neither approach is necessarily "wrong." However, `json_schemer`'s behavior, while valid, meant our initial strategy of relying solely on `insert_property_defaults: true` for full scaffolding from a sparse config wouldn't work as desired in our Ruby environment.

The GitHub issue [`insert_property_defaults` does not work for nested schemas (eg. oneOf) #94](https://github.com/davishmcclurg/json_schemer/issues/94) and the subsequent commit [aaafab1](https://github.com/davishmcclurg/json_schemer/commit/aaafab1b02e6017d3048ad62cfc125a33a5c217f) for `json_schemer` version 2.0.0 aimed to improve this, but the core issue seems to be that if a parent object is invalid due to its own `required` constraints, its subtree might not be considered "valid" for its children's default insertion.

## The Path Forward for OnetimeSecret

Given these findings, we're adopting a more explicit "Deep Merge" strategy in our Ruby configuration loading:

1.  **Programmatically Generate Full Defaults:** We'll traverse our `static-config.json` (generated from our Zod type definitions) to build a complete Ruby hash representing the entire configuration with all default values applied at every level.
2.  **Load User's Sparse Config:** Read the `config.yaml` provided by the user.
3.  **Deep Merge:** Merge the user's sparse configuration onto the full default hash. This ensures user settings override defaults, but all other defaults are present.
4.  **Validate the Merged Result:** Finally, pass this fully populated, merged hash to `json_schemer` for validation. At this stage, `json_schemer` primarily checks types, formats, and `required` constraints on a complete data structure.

This approach gives us precise control and ensures that our application always operates with a predictable, fully defaulted configuration, regardless of how sparse the user's `config.yaml` might be.

It's a reminder that even seemingly straightforward tasks can have hidden complexities, and understanding the nuances of our tools is key!

---

### Appendix: Test Scripts

For those interested in replicating these tests, here are the core scripts.

**Ruby (`json_schemer_test.rb`):**
```ruby
require 'json'
require 'json_schemer'
require 'pp'

minimal_schema = {
  "type" => "object",
  "properties" => {
    "config_section" => {
      "type" => "object", "default" => {},
      "properties" => {
        "setting1_with_default" => { "type" => "string", "default" => "default_for_setting1" },
        "setting2_required_no_default" => { "type" => "boolean" },
        "nested_object" => {
          "type" => "object", "default" => {},
          "properties" => {
            "deep_setting_with_default" => { "type" => "integer", "default" => 42 },
            "deep_setting_required_no_default" => { "type" => "string" }
          }, "required" => ["deep_setting_required_no_default"]
        }
      }, "required" => ["setting2_required_no_default", "nested_object"]
    },
    "top_level_prop_with_default" => { "type" => "string", "default" => "default_for_top_level" }
  }
}
# ... (scenarios and validation logic as in your provided script) ...
# Find the full script earlier in the discussion.
```
*(You can find the full Ruby script in the `json_schemer_test.rb` file we developed earlier.)*


**Node.js (`ajv_test.js`):**
```javascript
// ajv_test.js
import Ajv from "ajv";
import util from "util";

function deepCopy(obj) { return JSON.parse(JSON.stringify(obj)); }

const minimalSchema = { /* ... same as above ... */ };
const testScenarios = [ /* ... same scenarios ... */ ];

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
  // ... (error reporting) ...
});
```
*(See the earlier message for the full Node.js script.)*

**Python (`python_jsonschema_test.py`):**
```python
# python_jsonschema_test.py
import json
import copy
from jsonschema import Draft7Validator, validators

def extend_with_default(validator_class):
    validate_properties = validator_class.VALIDATORS["properties"]
    def set_defaults_for_properties(validator, properties, instance, schema):
        if isinstance(instance, dict):
            for property_name, subschema in properties.items():
                if "default" in subschema:
                    instance.setdefault(property_name, copy.deepcopy(subschema["default"]))
        yield from validate_properties(validator, properties, instance, schema)
    return validators.extend(validator_class, {"properties": set_defaults_for_properties})

DefaultFillingValidator = extend_with_default(Draft7Validator)
minimal_schema = { # ... same as above ... # }
test_scenarios = [ # ... same scenarios ... # ]

for scenario in test_scenarios:
    # ... (validation logic and manual top-level default application) ...
    # ... (error reporting) ...
    pass
```
*(The full Python script with its specific default handling logic was provided earlier.)*
