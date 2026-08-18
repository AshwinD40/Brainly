import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("Missing MONGODB_URI in environment");
  process.exit(1);
}

async function migrate() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;
    const usersCollection = db.collection("users");
    const contentsCollection = db.collection("contents");
    const brainsCollection = db.collection("brains");

    const users = await usersCollection.find({}).toArray();
    console.log(`Found ${users.length} registered user(s):`);
    for (const u of users) {
      console.log(` - ID: ${u._id.toString()} | Email: ${u.email} | Username: ${u.username}`);
    }

    if (users.length === 0) {
      console.log("\nNo registered users found in the database. Please sign up or sign in first.");
      process.exit(0);
    }

    const targetUser = users[users.length - 1];
    const targetUserId = targetUser._id;

    console.log(`\nMigrating orphaned/Clerk content items to User: ${targetUser.email} (ID: ${targetUserId})...`);

    const filter = {
      $or: [
        { userId: { $type: "string" } },
        { clerkUserId: { $exists: true } },
      ],
    };

    const countToUpdate = await contentsCollection.countDocuments(filter);
    console.log(`Found ${countToUpdate} content item(s) to migrate.`);

    if (countToUpdate > 0) {
      const updateResult = await contentsCollection.updateMany(filter, {
        $set: { userId: targetUserId },
        $unset: { clerkUserId: "" },
      });
      console.log(`Successfully updated ${updateResult.modifiedCount} content item(s)!`);
    } else {
      console.log("All content items are already properly assigned.");
    }

    const brainFilter = {
      $or: [
        { userId: { $type: "string" } },
        { clerkUserId: { $exists: true } },
      ],
    };
    const brainsToUpdate = await brainsCollection.countDocuments(brainFilter);
    if (brainsToUpdate > 0) {
      const brainResult = await brainsCollection.updateMany(brainFilter, {
        $set: { userId: targetUserId },
        $unset: { clerkUserId: "" },
      });
      console.log(`Successfully updated ${brainResult.modifiedCount} brain share record(s)!`);
    }

    console.log("\nMigration completed successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await mongoose.disconnect();
  }
}

void migrate();
