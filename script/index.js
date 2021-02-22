
        function makeRequest() {
            return new Promise((resolve, reject) => {
              let request = new XMLHttpRequest();
              request.open('GET', "http://localhost:3000/api/cameras");
              request.onreadystatechange = () => {
                if (request.readyState === 4) {
                  if(request.status === 200) {
                    resolve(JSON.parse(request.response));
                  } else {
                    reject('Désolé, une erreur est arrivée.');
                  }
                }
              }
              request.send();
            });
          };
          
          async function requestPromise() {
            try {
              const promiseRequest = makeRequest();
              const promiseResponse = await promiseRequest;
              createProductFigure(promiseResponse);
            } catch (error) {
              document.querySelector('.cardCam .card').innerHTML = '<h3 class="grid-heading">' + Erreur + de + chargement + '</h3>';
            }
          };
          
          requestPromise();