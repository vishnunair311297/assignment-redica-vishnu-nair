Note:

1. Webpack has been setup from scratch for both development and production mode to ensure proper caching and code minification.
2. Typescript support has been implemented and the code is written in Typescript.
3. Unit Tests have been written and is under the folder "__tests__". Tests have been written for the assignment provided
4. Functions and variables are memoized wherever possible, and useReducer hook is used for state management.
5. Styling and Reducers have been split into separate files.
6. WebAPI "requestIdleCallback" has been used for improved peformance.
7. Proper validations have been appplied for input fields which accept grid size, default speed, number of grabs and delta change in speed.
8. Speed Change after "N" number of grabs is calculated as follows: Current Speed / (1 + (delta change (%)) / 100).
9. Here, speed refers to the delay at which snake elements and food elements are painted to the canvas.


To Start the project, please follow the steps:

1. npm install
2. npm test - (To fetch the test reports) - Tests have been written for the assignment provided
2. npm start - (Starts up the development server)
