const fs = require('fs');
const express = require('express');
const app = express();

app.use(express.json());    // this [express.json] here is middleware

app.use((req, res, next) => {
    console.log('Hello from the middleware😊😂');
    next();
});
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});


const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

const getAllTours = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
        status: 'success',
        requestedAT: req.requestTime,
        results: tours.length,
        data: {
            tours
        }
    });
};

const getTour = (req, res) => {

    console.log(req.params);

    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id);

    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
};
const createTour = (req, res) => {
    // const newID = tours[tours.length - 1].id + 1;
    const newID = tours.length;
    const newTour = Object.assign({id: newID}, req.body);

    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
            res.status(201).json({
                status: 'success',
                data: {
                    tour: newTour
                }
            });
        }
    );

    // res.send('Done');
};

const updateTour = (req, res) => {

    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here...>'
        }
    });
};

const deleteTour = (req, res) => {

    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
};

// one way
// app.get('/api/v1/tours', getAllTours);    // instead of passing the callback function directly, just do getAllTours
// app.get('/api/v1/tours/:id', getTour);    // responding to URL parameters
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);


//  better way
app.route('/api/v1/tours')
    .get(getAllTours)
    .post(createTour);
app.route('/api/v1/tours/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);


const port = 3000;
app.listen(port, () => {
    console.log(`APP running on port ${port}...`);
});


