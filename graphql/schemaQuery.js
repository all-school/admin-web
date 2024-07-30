const fetch = require('node-fetch');
const fs = require('fs');
const dot = require('dotenv');
//import dotenv from 'dotenv';

dot.config();
const apiUrl = process.env.REACT_APP_API_URL;

fetch(apiUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    variables: {},
    query: `
      {
        __schema {
          types {
            kind
            name
            possibleTypes {
              name
            }
          }
        }
      }
    `
  })
})
  .then((result) => result.json())
  .then((result) => {
    console.log(result);
    // here we're filtering out any type information unrelated to unions or interfaces
    const filteredData = result.data.__schema.types.filter(
      (type) => type.possibleTypes !== null
    );
    result.data.__schema.types = filteredData;
    fs.writeFileSync(
      'src/fragmentTypes.json',
      JSON.stringify(result.data),
      (err) => {
        if (err) {
          console.error('Error writing fragmentTypes file', err);
        } else {
          console.log('Fragment types successfully extracted!');
        }
      }
    );
  });
