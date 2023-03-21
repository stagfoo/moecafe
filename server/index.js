var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var _this = this;
var express = require('express');
var Reddit = require('reddit');
var app = express();
var path = require('path');
var fs = require('fs'); // Built-in filesystem package for Node.js
var get = require('get');
// Set the public folder as the static directory
app.use(express.static(path.join(__dirname, 'public')));
function normalizePosts(post, i) {
    return {
        oldImage: post.url,
        image: "/memes/".concat(i, ".png"),
        id: post.id,
        title: post.title
    };
}
/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    var _a;
    for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _a = [a[j], a[i]], a[i] = _a[0], a[j] = _a[1];
    }
    return a;
}
function imageDownloader(imageUrl, name) {
    var dl = new get({ uri: imageUrl });
    //add video
    dl.toDisk("./server/public/memes/".concat(name, ".png"), function (err, filename) {
        console.log(filename, err);
    });
    return dl;
}
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});
app.get('/video', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var reddit, posts, filteredPosts;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                reddit = new Reddit({
                    username: process.env.REDDIT_USERNAME,
                    password: process.env.REDDIT_PASSWORD,
                    appId: process.env.APP_ID,
                    appSecret: process.env.APP_SECRET,
                    userAgent: 'MoeCafe/1.0.0'
                });
                return [4 /*yield*/, reddit.get('/r/Animemes/top', {
                        limit: 11,
                        is_video: false,
                        over_18: false
                    })];
            case 1:
                posts = _a.sent();
                filteredPosts = posts.data.children.filter(function (c) {
                    return !c.data.is_video && !c.data.over_18;
                });
                console.log(filteredPosts);
                res.send(shuffle(filteredPosts.map(function (c, i) {
                    console.log(i, imageDownloader(c.data.url, i));
                    return normalizePosts(c.data, i);
                })).splice(0, 11));
                return [2 /*return*/];
        }
    });
}); });
app.listen(3000, function () { return console.log('Example app is listening on port 3000.'); });
