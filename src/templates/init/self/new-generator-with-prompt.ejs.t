---
to: _templates/generator/with-prompt/hello.ejs.t
---
---
to: _templates/<%%= name %%>/<%%= action || 'new' %%>/hello.ejs.t
---
---
to: app/hello.js
---
const hello = ```
Hello!
This is your first prompt based pinion template.

Learn what it can do here:

https://github.com/feathersjs/pinion
```

console.log(hello)


