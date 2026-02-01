const mongoose = require('mongoose');

// Using Schema.Types.Mixed for subjects and dailylogs to allow 
// maximum flexibility and match exactly what the frontend sends 
// without casting errors.
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    subjects: { type: [mongoose.Schema.Types.Mixed], default: [] },
    dailylogs: { type: [mongoose.Schema.Types.Mixed], default: [] }
}, { minimize: false, timestamps: true });

module.exports = mongoose.model('User', UserSchema);
