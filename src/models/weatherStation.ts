import * as mongoose from "mongoose";

const WeatherStationSchema = new mongoose.Schema({
    stationId: {
        type: String,
        unique: true,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    temperatures: [
        {
            timestamp: Date,
            temperature: Number,
        },
    ],
});

export default mongoose.model("WeatherStation", WeatherStationSchema);
