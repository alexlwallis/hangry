"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var fetch = require('node-fetch');
var keyPath = path.resolve('key.json');
var key = require(keyPath).key;
var axios = require("axios");
function validLocation(lat, lon, cb) {
    return __awaiter(this, void 0, void 0, function () {
        var parameters;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parameters = {
                        lat: lat,
                        lon: lon
                    };
                    return [4 /*yield*/, axios.get('https://developers.zomato.com/api/v2.1/geocode', {
                            params: parameters,
                            headers: {
                                'user-key': key,
                                'Accept': 'application/json'
                            }
                        })
                            .then(function (res) {
                            console.log("validLocation; ", res);
                            cb(res);
                        })["catch"](function (err) {
                            cb(err.isAxiosError);
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.validLocation = validLocation;
function retrieveData(lat, lon, start, count, cb) {
    return __awaiter(this, void 0, void 0, function () {
        var parameters;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    //Change count to 20 later.
                    // validLocation(lat, lon, (e:any)=>console.log('validLocation: ',e))
                    console.log('here retrieveData');
                    parameters = {
                        lat: lat,
                        lon: lon,
                        start: start,
                        count: count
                    };
                    //Looks like axios abstracts away the buffers?
                    //Unsure if putting await before axios.get makes it slower..
                    return [4 /*yield*/, axios.get('https://developers.zomato.com/api/v2.1/search', {
                            params: parameters,
                            headers: {
                                'user-key': key,
                                'Accept': 'application/json'
                            }
                        })
                            .then(function (res) {
                            //For some reason if I set necessaryData to Object it wont let me add a key to it a la necessaryData.key
                            //future reading => https://stackoverflow.com/questions/32968332/how-do-i-prevent-the-error-index-signature-of-object-type-implicitly-has-an-an
                            //res.data.restaurants.map((item:any) => console.log(item.restaurant.location.country_id))
                            var necessaryData = {};
                            res.data.restaurants.map(function (item) {
                                var key = (item.restaurant.name);
                                var interestingData = [item.restaurant.location.address, item.restaurant.cuisines, item.restaurant.average_cost_for_two, item.restaurant.user_rating.aggregate_rating, item.restaurant.phone_numbers, item.restaurant.timings, item.restaurant.establishment, item.restaurant.name, item.restaurant.location.latitude, item.restaurant.location.longitude, item.restaurant.currency];
                                necessaryData[key] = interestingData;
                            });
                            cb(necessaryData);
                        })["catch"](function (err) { return console.log(err); })];
                case 1:
                    //Looks like axios abstracts away the buffers?
                    //Unsure if putting await before axios.get makes it slower..
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.retrieveData = retrieveData;
function chosenPlaceToRestaurants(id, start, count, cb) {
    return __awaiter(this, void 0, void 0, function () {
        var param;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('here chosenPlaceToRestaurants');
                    param = {
                        entity_id: id,
                        entity_type: 'city',
                        start: start,
                        count: count
                    };
                    return [4 /*yield*/, axios.get('https://developers.zomato.com/api/v2.1/search', {
                            params: param,
                            headers: {
                                'user-key': key,
                                'Accept': 'application/json'
                            }
                        })
                            .then(function (res) {
                            //res.data.restaurants.forEach((element:any) => console.log(element.restaurant.currency));
                            var necessaryData = {};
                            res.data.restaurants.map(function (item) {
                                var key = (item.restaurant.name);
                                //Try out the item.restaurant.menu_url.
                                //Might want to download a library to parse it.
                                var interestingData = [item.restaurant.location.address, item.restaurant.cuisines, item.restaurant.average_cost_for_two, item.restaurant.user_rating.aggregate_rating, item.restaurant.phone_numbers, item.restaurant.timings, item.restaurant.establishment, item.restaurant.name, item.restaurant.location.latitude, item.restaurant.location.longitude, item.restaurant.currency];
                                necessaryData[key] = interestingData;
                            });
                            //console.log('necessaryData: ~~~~~~~~',necessaryData)
                            cb(necessaryData);
                        })["catch"](function (err) { console.error(err); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.chosenPlaceToRestaurants = chosenPlaceToRestaurants;
function locationToCoords(q, cb) {
    console.log('here locationToCoords');
    var parameters = {
        q: q
    };
    axios.get('https://developers.zomato.com/api/v2.1/cities', {
        params: parameters,
        headers: {
            'user-key': key,
            'Accept': 'application/json'
        }
    })
        .then(function (res) {
        //console.log('res: ',res.data.location_suggestions)
        var necessaryData = {};
        res.data.location_suggestions.map(function (item) {
            var name = item.name;
            necessaryData[name] = [item.country_name, JSON.stringify(item.id)];
        });
        console.log('lTC: ', necessaryData);
        cb(necessaryData);
    })["catch"](function (err) { console.error(err); });
}
exports.locationToCoords = locationToCoords;
