const JaySchema = require('jayschema')
const schema = require('./schemas/insight.json')

function handleSchemaError (schemaErrors) {
  const handledErrors = schemaErrors.map(error => ({
    location: error.instanceContext.replace('#/', ''),
    failing: error.constraintName,
    expected: error.constraintValue,
    given: error.testedValue
  }))

  return handledErrors
}

function fillSchemaWithRules (schema, rules) {
  rules.forEach(rule => {
    Object.keys(schema.properties).some(schemaProperty => {
      if (schemaProperty === rule.property) {
        schema.properties[schemaProperty].properties.value.enum = rule.enum
        return true
      }
    })
  })

  return schema
}

function baseLinter (json, rules) {
  return new Promise(resolve => {
    const jayschema = new JaySchema()
    const filledSchema = fillSchemaWithRules(schema, rules)
    jayschema.validate(JSON.parse(json), filledSchema, function (errors) {
      if (errors) {
        resolve(errors)
      } else {
        resolve(false)
      }
    })
  })
}

const json = '{"author":{"value":"M","line":2,"column":8,"tip":"author:","length":1},"levels":{"value":[{"value":"basic","line":4,"column":5,"tip":"levels:","length":5},{"value":"medium","line":5,"column":5,"tip":"levels:","length":6}],"line":3,"column":1,"tip":"levels:","length":11},"type":{"value":"normal","line":6,"column":6,"tip":"type:","length":6},"category":{"value":"tip","line":7,"column":10,"tip":"category:","length":3},"tags":{"value":[{"value":"list","line":9,"column":5,"tip":"tags:","length":4},{"value":"of","line":10,"column":5,"tip":"tags:","length":2},{"value":"tags","line":8,"column":1,"tip":"tags:","length":4}],"line":8,"column":1,"tip":"tags:","length":10},"notes":{"value":"whatever","line":12,"column":7,"tip":"notes:","length":8},"inAlgoPool":{"value":false,"line":13,"column":12,"tip":"inAlgoPool:","length":5},"links":{"value":[{"value":{"name":"name","url":"url","nature":"website"},"line":15,"column":6,"tip":"links:","length":11},{"value":{"name":"name","url":"url","nature":"forum"},"line":16,"column":6,"tip":"links:","length":18}],"line":14,"column":1,"tip":"links:","length":29},"headline":{"value":"This is the headline","line":1,"column":3,"tip":"# My Headline (First line in .md)","length":20},"content":{"value":"`vmstat` allows the user to monitor virtual\n    memory statistics such as processes, memory,\n    paging, block IO, traps , disks and cpu\n    activity.\n\n    The user can specify a sampling period.\n\n    ```bash\n    $ vmstat 1\n    procs-----------memory----------\n     r  b   swpd   free   buff  cache\n     4  0 920708  74004  36324 114148\n     ---swap-------io---- -system--\n       si   so    bi    bo   in   cs\n       29   53   125   112  298  212\n       ----cpu----\n     us sy id wa\n     26  6 65  3\n    ```\n\n    The above will run `vmstat` every second and\n    display system virtual memory usage such\n    as:\n    - `r` number process waiting to run\n    - `b`\n    blocked process\n    - `swpd` virtual memory used\n    -\n    `free` idle memory\n    -  `bi`, `bo` number of\n    blocks sent and received from disk\n    - `us`\n    time spent in user code\n    - `sy` time spent in\n    kernel code\n\n    As current Linux blocks are `1024` bytes, `vmstat` uses the same unit of measurement for memory.\n\n","line":20,"column":1,"tip":"## Content","length":994},"gameContent":{"value":"game content","line":61,"column":1,"tip":"## Game Content","length":14},"practiceQuestion":{"value":"practice question","line":66,"column":1,"tip":"## Practice","length":19},"reviseQuestion":{"value":"revision question","line":71,"column":1,"tip":"## Revision","length":19},"footnotes":{"value":"no idea what is should look like","line":76,"column":1,"tip":"## Footnotes","length":32},"parent":{"value":null,"line":null,"column":null,"tip":"parent:","length":0}}'
   .replace(/[\u0000-\u0019]+/g, '') // Cleans any bad chars in the json

const rules = [
  {
    property: 'category',
    enum: [
      'only', 'the', 'categories', 'in', 'database'
    ]
  }
]
baseLinter(json, rules)
  .then(errors => {
    if (Array.isArray(errors)) {
      console.log(handleSchemaError(errors))
    } else {
      console.log('JSON Good enough')
    }
  })
