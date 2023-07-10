const User = require("../models/Users");
module.exports = {
    TrackDrivers: async (req, res) => {
        try {
            const { latitude, longitude } = req.query;
            console.log(latitude, longitude);
            const distance = Number(req.query.distance) || 5 * 1000;
            if (!latitude || !longitude) {
                return res.status(404).json({ status: 'fail!', message: 'Invalid latitude or longitude' });
            }
            // const filter = {};
            // Add location-based filtering if latitude and longitude are provided
            // if (latitude && longitude) {
            //     filter.location = {
            //         $near: {
            //             $geometry: {
            //                 type: 'Point',
            //                 coordinates: [parseFloat(longitude), parseFloat(latitude)],
            //                 // "$maxDistance" : 100
            //             },
            //             // $distanceField: 'distance',
            //             $maxDistance: 1*1000,
            //             $spherical: true 
            //         },

            //     };
            //     filter.role = 'driver'
            // }
            // const driver = await User.find(filter).select("name email phone rating");
            const rides = await User.aggregate([
                {
                    $geoNear: {
                        near: {
                            type: 'Point',
                            coordinates: [parseFloat(longitude), parseFloat(latitude)],
                        },
                        distanceField: 'distance',
                        maxDistance: distance,
                        spherical: true,
                        distanceMultiplier: 0.001, // Convert distance to kilometers
                    },
                },
                {
                    $match: {
                        role: 'driver', // Filter documents where age is greater than or equal to 18
                    },
                },
                // select fields from database table
                {
                    $project: {name:1, email: 1, phone: 1, rating: 1, location: 1, distance: 1 }
                }

            ]);
            res.status(200).json({
                status: `success`,
                results: rides.length,
                data: {
                    rides
                }
            });
        } catch (err) {
            res.status(401).json({ status: `fail`, message: err.message });
        }
    },
}