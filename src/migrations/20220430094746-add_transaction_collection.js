module.exports = {
  async up(db) {
    await db.createCollection("transactions")
  },

  async down(db) {
    await db.transactions.drop()
  }
};
