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
    - Fulfilled
    - Rejected
  - A promise callback function follows a certain signature (e.g \```function callback(resolve, reject) { 
  resolve('done');}``)
  - Promises can be chained
    - Catch and finally functions can be chained too to grab issues from other chained functions 
    - You can use async/await syntax to handle promises instead
      - Async always wraps the function in a promise
      - Await needs to be called from the highest level or another async function
## _Class Notes from 5/25_
- **UX Design**
  - 3 main principles
    1. Tell a story
       - Focus on the user and what you are pitching to users that visit your site
    2. Simplicity
       - Include only the most important elements users should focus on and eliminate any distractions.
    3. Consistent
       - When you follow standard UX practices, users don't have to put too much strain to find what they are looking for
- Be intentional with your design, only add walls in the user's flow when it's really important to your use case
  - Put the wall up only when the wall is needed.
## _Class Notes from 5/30_
- **Web services**
  - Cross-origin resource sharing
    - If the front end is making requests to another service that doesn't return your host name or * for Access-Control-Allow-Origin it will be blocked by the browser
  - Always think from the user's perspective, model out the flows different users might follow
- **Node JS**
  - Same JS interpreter as Chrome stripped to run on a server for backend operations
  - **Express**
    - A wrapper around HTTP requests to make them a little simpler to write for Node
## _Class Notes from 6/1_
- **MongoDB**
  - Allows you to represent your data as JSON objects
  - You can make collections and store schema free JSON inside the collections
    - Collections are somewhat analogous to tables in SQL, but you don't have to define what values your table will hold up front and entries don't have to match key pairs or values
## _Class Notes from 6/13_
- **Security**
  - Least privilege access violation principle means give as little permissions to the users as they need to use the website. Here's two problems that can come from failing to follow it:
    - URL bypass control (bypass the controls of the website just by knowing the right url)
    - Resource ID allows access (knowing the right resource allows the user to get access to files they otherwise would not have)
  - Cryptographic failures
    - Encrypting only at rest
    - Weak cryptography (SHA1, MD5)
    - Misused cryptography (no salt, wrong params)
  - Insecure design
    - Unlimited trial accounts
    - Not aware of best practices
    - Customer data not segmented
    - Single layer defense
  - Security misconfigurations
    - Dev info exposed
    - Using default configurations
    - Unnecessary features installed
    - System not hardened
  - Vulnerable components
    - Unneeded/unused packages imported
    - Untrusted/verified sources
    - Out of date software
    - Not tracking vulnerability bulletins
    - Package versions not locked
  - ID and auth failures
    - Credential stuffing
    - Brute force attacks
    - Permitting weak passwords
    - Weak credential recovery
    - Credentials in the URL
    - Not expiring auth tokens
  - Software integrity failures
    - Unverified CDN usage
    - Unverified packages
    - Unverified updates
    - Insecure CD/CI platforms
  - Logging failures
    - Not logging critical requests
    - Not monitoring system performance
    - Logs not audited, automatic or manual
    - Logs not stored centrally
    - No real-time response
  - Server side request forgery
    - I need to go back and review this one
- TypeScript
  - Adds static type checking (int, string, etc)
  - Adds interfaces