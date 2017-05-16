(function() {
    function randomizeArray(size) {
        const array = [];
        const valuesToRandom = [1, -1];
        for(let i = 0; i < size; i++) {
            const secondArray = [];
            for(let j = 0; j < size; j++) {
                secondArray.push(valuesToRandom[Math.floor(Math.random() * 2) + 0]);
            }
            array.push(secondArray);
        }
        return array;
    }

    function findNeighboursValues(array, currentNode) {
        
        const neighbours = {};
        const arrayLength = array.length - 1;

        if(currentNode.y == 0 && currentNode.x == 0) {
            // left top corner case
            neighbours.top = array[arrayLength][0];
            neighbours.bottom = array[1][0];
            neighbours.left = array[0][arrayLength];
            neighbours.right = array[0][1];
        } else if(currentNode.x == arrayLength && currentNode.y == 0) {
            // right top corner case
            neighbours.top = array[arrayLength][arrayLength];
            neighbours.bottom = array[1][arrayLength];
            neighbours.left = array[0][arrayLength - 1];
            neighbours.right = array[0][0];
        } else if(currentNode.x == 0 && currentNode.y == arrayLength) {
            // left bottom corner case
            neighbours.top = array[arrayLength - 1][0];
            neighbours.bottom = array[0][0];
            neighbours.left = array[arrayLength][arrayLength];
            neighbours.right = array[arrayLength][1];
        } else if(currentNode.x == arrayLength && currentNode.y == 0) {
            // right bottom corner case
            neighbours.top = array[arrayLength - 1][arrayLength];
            neighbours.bottom = array[0][arrayLength];
            neighbours.left = array[arrayLength][arrayLength - 1];
            neighbours.right = array[arrayLength][0];
        } else if(currentNode.y == 0) {
            // top case
            neighbours.top = array[arrayLength][currentNode.x];
            neighbours.bottom = array[1][currentNode.x];
            neighbours.left = array[0][currentNode.x - 1];
            neighbours.right = array[0][currentNode.x + 1];
        } else if(currentNode.y == arrayLength) {
            // bottom case
            neighbours.top = array[arrayLength - 1][currentNode.x];
            neighbours.bottom = array[0][currentNode.x];
            neighbours.left = array[arrayLength][currentNode.x - 1];
            neighbours.right = array[arrayLength][currentNode.x + 1];
        } else if(currentNode.x == 0) {
            // left case
            neighbours.top = array[currentNode.y - 1][currentNode.x];
            neighbours.bottom = array[currentNode.y + 1][currentNode.x];
            neighbours.left = array[currentNode.y][arrayLength];
            neighbours.right = array[currentNode.y][1];
        } else if(currentNode.x == arrayLength) {
            // right case
            neighbours.top = array[currentNode.y - 1][currentNode.x];
            neighbours.bottom = array[currentNode.y + 1][currentNode.x];
            neighbours.left = array[currentNode.y][arrayLength - 1];
            neighbours.right = array[currentNode.y][0];
        } else {
            // middle cases
            neighbours.top = array[currentNode.y - 1][currentNode.x];
            neighbours.bottom = array[currentNode.y + 1][currentNode.x];
            neighbours.left = array[currentNode.y][currentNode.x - 1];
            neighbours.right = array[currentNode.y][currentNode.x + 1];
        }

        return neighbours;
    }

    function monteCarloStep(array, temperature) {
        const itemsInArray = array.length**2;
        for(let i = 0; i < itemsInArray; i++) {
            const currentNode = {
                x: Math.floor(Math.random() * (array.length)) + 0,
                y: Math.floor(Math.random() * (array.length)) + 0
            }

            const neighbours = findNeighboursValues(array, currentNode);
            
            // start energy
            const ep = (-1) * array[currentNode.y][currentNode.x] * (neighbours.top + neighbours.bottom + neighbours.left + neighbours.right);
            // end energy
            const ek = array[currentNode.y][currentNode.x] * (neighbours.top + neighbours.bottom + neighbours.left + neighbours.right);

            const delta = ek - ep;

            if(delta > 0) {
                const w = (-1) * delta / temperature;
                const e = Math.exp(w);
                const random = Math.random() * 1;
                if(randomCheck(e, random)) {
                    array[currentNode.y][currentNode.x] *= -1;
                }

            } else {
                array[currentNode.y][currentNode.x] *= -1;
            }

        }
    }

    function randomCheck(exponential, random) {
        return random <= exponential;
    }

    function createExperiment(temperature, monteCarloSteps, array) {
        for(let i = 0; i < monteCarloSteps; i++) {
            setTimeout(() => {
                monteCarloStep(array, temperature);
                draw(array);
                if(i % 100 == 0) {
                    const magnet = mag(array);
                    myChart.data.datasets[0].data.push(magnet); 
                    myChart.update();
                    p.textContent = magnet;
                }
            }, 0);
        }

    }

    function mag(array) {
        let sum = 0;
        for(let i = 0; i < array.length; i++) {
            for(let j = 0; j < array.length; j++) {
                sum += array[i][j];
            }
        }

        return Math.abs(sum) / array.length**array.length;
    }

    function draw(array) {
        board.clearRect(0, 0, canvas.width, canvas.height);
        let posY = 0;
        let size = 800 / array.length;
        for(let i = 0; i < array.length; i++) {
            let posX = 0;
            for(j = 0; j < array[i].length; j++) {
               if(array[i][j] == 1) {
                    board.fillStyle="aquamarine";
                    board.fillRect(posX,posY,size,size);
               } else {
                    board.fillStyle="#333333";
                    board.fillRect(posX,posY,size,size);
               }
               posX += size;
            }
            posY += size;
        }
        

    }
    

    const canvas = document.querySelector("canvas");
    const board = canvas.getContext("2d");
    const ctx = document.querySelector("#chart").getContext("2d");
    const p = document.querySelector("p");
	const  myChart = new Chart(ctx, {
	    type: 'line',
	    data: {
		labels: [],
		datasets: [{
		    label: 'Chart',
		    data: [],
		    backgroundColor: [
		        'rgba(255, 99, 132, 0.2)',
		        'rgba(54, 162, 235, 0.2)',
		        'rgba(255, 206, 86, 0.2)',
		        'rgba(75, 192, 192, 0.2)',
		        'rgba(153, 102, 255, 0.2)',
		        'rgba(255, 159, 64, 0.2)'
		    ],
		    borderColor: [
		        'rgba(255,99,132,1)',
		        'rgba(54, 162, 235, 1)',
		        'rgba(255, 206, 86, 1)',
		        'rgba(75, 192, 192, 1)',
		        'rgba(153, 102, 255, 1)',
		        'rgba(255, 159, 64, 1)'
		    ],
		    borderWidth: 1
		}]
	    },
	    options: {
		responsive: false,
		scales: {
		    yAxes: [{
                display: false,
		        ticks: {
		            beginAtZero:true
		        }
		    }]
		}
	    }
	});
    createExperiment(2, 50000, randomizeArray(50));

    //myChart.data.datasets[0].data = [1,2,2,2,2,2,2,2]
    //myChart.update()

     
})();
