import {NextFunction, Request, Response} from "express";
import WeatherStation from "../models/weatherStation";

const rateLimit = async (req: Request, res: Response, next: NextFunction) => {
    const {stationId} = req.body;

    if (!stationId) {
        res.status(400).json({error: "stationId is required"});
        return;
    }

    try {
        const weatherStation: any = await WeatherStation.findOne({stationId});

        if (weatherStation && weatherStation.temperatures.length > 0) {
            const latestTimestamp = weatherStation.temperatures[weatherStation.temperatures.length - 1].timestamp;
            const now = new Date();
            const timeDifference = (now.getTime() - latestTimestamp.getTime()) / 1000;

            if (timeDifference < 60) {
                res.status(429).json({error: "You can only report a temperature once a minute"});
                return;
            }
        }
    } catch (error) {
        res.status(500).json({error: error.message});
        return;
    }

    next();
};

export default rateLimit;
