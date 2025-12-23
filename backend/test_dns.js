import 'dotenv/config';
import dns from 'dns';
import mongoose from 'mongoose';

const uri = process.env.MONGO_URI;
console.log('Testing connection to:', uri ? uri.split('@')[1] : 'UNDEFINED');

if (!uri) {
    console.error('MONGO_URI is not set');
    process.exit(1);
}

// Extract hostname from URI (assuming mongodb+srv://...)
const hostname = uri.split('@')[1] ? uri.split('@')[1].split('/')[0] : null;

if (hostname) {
    console.log(`Attempting to resolve DNS for: _mongodb._tcp.${hostname}`);
    dns.resolveTxt(`_mongodb._tcp.${hostname}`, (err, addresses) => {
        if (err) {
            console.error('DNS TXT lookup failed:', err.code);
            console.log('Trying standard A record lookup...');
            dns.lookup(hostname, (err, address, family) => {
                if (err) console.error('DNS A lookup failed:', err.code);
                else console.log('DNS A lookup successful:', address, 'Family:', family);
            });
        } else {
            console.log('DNS TXT lookup successful:', addresses);
        }
    });
} else {
    console.log("Could not extract hostname for DNS test.");
}

console.log('Attempting Mongoose connection...');
mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        console.log('Mongoose Connected Successfully!');
        process.exit(0);
    })
    .catch(err => {
        console.error('Mongoose Connection Error:', err.message);
        process.exit(1);
    });
