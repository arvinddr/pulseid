module.exports = {
  async up(db) {
    await db.createCollection("cashbacks")
  },

  async down(db) {
    await db.cashbacks.drop()
  }
};
