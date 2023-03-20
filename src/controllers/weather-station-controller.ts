import WeatherStation from "../models/weatherStation";

export const reportTemperature = async (req: any, res: any) => {
    const {stationId, temperature} = req.body;

    if (!stationId || !temperature) {
        res.status(400).json({error: "stationId and temperature are required"});
        return;
    }

    try {
        const weatherStation: any = await WeatherStation.findOneAndUpdate(
            {stationId},
            {$push: {temperatures: {timestamp: new Date(), temperature}}},
            {new: true, upsert: true}
        );
        res.status(200).json(weatherStation);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

export const getTemperatureLog = async (req: any, res: any) => {
    const {stationId} = req.params;

    try {
        const weatherStation: any = await WeatherStation.findOne({stationId});
        res.status(200).json(weatherStation?.temperatures || []);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

export const deleteTemperatureLog = async (req: any, res: any) => {
    const {stationId} = req.params;

    try {
        await WeatherStation.findOneAndUpdate(
            {stationId},
            {$set: {temperatures: []}}
        );
        res.status(200).json({message: "Temperature log deleted successfully"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

export const getTemperatureStats = async (req: any, res: any) => {
    const {stationId} = req.params;

    try {
        const weatherStation: any = await WeatherStation.findOne({stationId});

        if (!weatherStation) {
            res.status(404).json({error: "Weather station not found"});
            return;
        }

        const temperatures: any = weatherStation.temperatures.map(
            (entry: any) => entry.temperature
        );
        const average =
            temperatures.reduce((sum: any, temp: any) => sum + temp, 0) / temperatures.length;
        const min = Math.min(...temperatures);
        const max = Math.max(...temperatures);
        const median =
            temperatures.length % 2 === 0
                ? (temperatures[temperatures.length / 2 - 1] +
                    temperatures[temperatures.length / 2]) /
                2
                : temperatures[Math.floor(temperatures.length / 2)];

        res.status(200).json({average, min, max, median});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

export const getDateRangeTemperatureStats = async (req: any, res: any) => {
    const {stationId, startDate, endDate} = req.params;

    try {
        const weatherStation: any = await WeatherStation.findOne({stationId});

        if (!weatherStation) {
            res.status(404).json({error: "Weather station not found"});
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        const temperatures = weatherStation.temperatures
            .filter((entry: any) => entry.timestamp >= start && entry.timestamp <= end)
            .map((entry: any) => entry.temperature);

        if (temperatures.length === 0) {
            res.status(404).json({error: "No temperature data in the specified date range"});
            return;
        }

        const average =
            temperatures.reduce((sum: any, temp: any) => sum + temp, 0) / temperatures.length;
        const min = Math.min(...temperatures);
        const max = Math.max(...temperatures);
        const median =
            temperatures.length % 2 === 0
                ? (temperatures[temperatures.length / 2 - 1] +
                    temperatures[temperatures.length / 2]) /
                2
                : temperatures[Math.floor(temperatures.length / 2)];

        res.status(200).json({average, min, max, median});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

