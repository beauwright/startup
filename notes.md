# _GitHub Notes_

- **Git**: provides version tracking and repository cloning
- **GitHub**: cloud-based service for Git repositories
- **Repository creation**: Create a repository on GitHub, then clone to development environment
- **Workflow**: 
    1. git pull
    2. make changes
    3. git commit
    4. git push
- **Merge conflicts**: Handle by resolving differences and committing resolution
- **Documentation**: Use README.md and notes.md for documentation and tracking learning progress
- **Forks**: Copy GitHub repositories for experimentation or contribution
    - Forks maintain links to original repositories for updates and pull requests
- **Pull requests**: Suggest changes to original repositories from forks

# JavaScript Notes 
## _Class Notes from 5/16_
- **JS is a weakly typed language**
  - Declare mutable vars with let, immutable with const
  - var is depreciated, do not use
  - Uses C style formatting for a lot of syntax
- **Functions**
  - can be declared with function or as an arrow function `````=>`````
  - Must have a return type if curly braces are used, uses implicit return otherwise.
  - Functions are sort of like objects in JS, can be given a name, passed as a parameter, returned as a result, and referenced from an object or array like a variable would be.
      - TODO: Learn more about anon functions
      - De
      - TODO: Learn more about destructuring arrays
- **Operators**
  - TODO: Read about ```??```, ```?=```, ```||```, and ```rest``` operators
  - ```=>``` makes function
  - TODO: Look up ```reduce``` and ```filter``` functions
  - Why have I seen JS with {{ in a row, was that nested functions or something else?

## _Class Notes from 5/18_
- **JSON**
  - JSON in JS works similar to GSON, you get the object constructed using the same values
- **DOM (Document Object Model)**
  - HTML and CSS gets turned into a node tree of objects to render the webpage known as a DOM
    - DOM can be manipulated with JavaScript
- **JS Modules**
  - TODO: Research more about JS modules and when to use them.

## _Class Notes from 5/23_
- **Promises**
  - 3 states
    - Pending
    - Fufilled
    - Rejected
  - A promise callback function follows a certain signature (e.g \```function callback(resolve, reject) { 
  resolve('done');}``)
  - Promises can be chained
    - Catch and finally functions can be chained too to grab issues from other chained functions 
    - You can use async/await syntax to handle promises instead
      - Async always wraps the function in a promise
      - Await needs to be called from the highest level or another aync function