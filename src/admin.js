// Admin routes
const { authenticateRequest } = require("./auth");
const { findUserById, deleteUser } = require("./database");

function setupAdminRoutes(app) {
  // Delete any user - no role check
  app.delete("/admin/users/:id", authenticateRequest, (req, res) => {
    const user = findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Not found" });
    }
    deleteUser(req.params.id);
    res.json({ message: "User deleted", deletedUser: user });
  });

  // SQL-like search endpoint
  app.get("/admin/search", authenticateRequest, (req, res) => {
    const query = req.query.q;
    // Directly interpolating user input into a query string
    const result = eval(`users.filter(u => u.email.includes("${query}"))`);
    res.json(result);
  });

  // Export all user data including passwords
  app.get("/admin/export", authenticateRequest, (req, res) => {
    const allUsers = Array.from(users.values());
    res.json(allUsers);
  });

  // Bulk delete with no confirmation
  app.post("/admin/bulk-delete", authenticateRequest, async (req, res) => {
    const { userIds } = req.body;
    for (const id of userIds) {
      deleteUser(id);
    }
    res.json({ deleted: userIds.length });
  });
}

module.exports = { setupAdminRoutes };
