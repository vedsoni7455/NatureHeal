import 'dotenv/config';
import mongoose from 'mongoose';

const uri = process.env.MONGO_URI;

if (!uri) {
    console.error('MONGO_URI is not set');
    process.exit(1);
}

// Parse the SRV URI to extract credentials and db name
// Expected format: mongodb+srv://<user>:<password>@<host>/<dbname>?...
const match = uri.match(/^mongodb\+srv:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]+)/);

if (!match) {
    console.error('Could not parse MONGO_URI');
    process.exit(1);
}

const [_, user, password, host, dbname] = match;

// Construct the standard URI
// Assume host in SRV is "natureheal.bjagzuq.mongodb.net" -> "natureheal-shard-00-00.bjagzuq.mongodb.net", etc.
// The "host" from regex is the SRV hostname.
const clusterName = host.split('.')[0];
const hash = host.split('.')[1];

const shard0 = `${clusterName}-shard-00-00.${hash}.mongodb.net:27017`;
const shard1 = `${clusterName}-shard-00-01.${hash}.mongodb.net:27017`;
const shard2 = `${clusterName}-shard-00-02.${hash}.mongodb.net:27017`;

const standardUri = `mongodb://${user}:${password}@${shard0},${shard1},${shard2}/${dbname}?ssl=true&replicaSet=atlas-${clusterName}-shard-0&authSource=admin`;

console.log('Original URI Host:', host);
console.log('Testing Standard URI (redacted):', standardUri.replace(password, '****'));

mongoose.connect(standardUri, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        console.log('✅ Connected Successfully using Standard URI!');
        // Keep connection open briefly to verify
        setTimeout(() => {
            mongoose.disconnect();
            process.exit(0);
        }, 1000);
    })
    .catch(err => {
        console.error('❌ Connection Failed:', err.message);
        process.exit(1);
    });
