const request = require('request-promise');

// setup for uclassify used for categorizing todo_names
const fetchCategory = (text) => {
  const username = 'hbk';
  const classifierName = 'lhlmidterm';

  const uClassifyAcc = {
    'method': 'POST',
    'uri': `https://api.uclassify.com/v1/${username}/${classifierName}/classify`,
    'headers': {
      'Content-Type': 'application/json',
      'Authorization': `Token CWELq0BOEcrS`, //your key
    },
    'body': {
      'texts': [text],
    },
    'json': true,
  };

  return request(uClassifyAcc)
    .then((res) => {
      let result = {};
      let highp = 0;
      for (let cat of res[0].classification) {
        if (highp < cat.p) {
          result.className = cat.className;
          highp = cat.p;
        }
      }

      // result ex: {className: "read"}
      return result;
    })

}

module.exports = { fetchCategory };
