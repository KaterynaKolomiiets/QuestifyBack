const express = require("express");
const router = express.Router();
const todosController = require("../controllers/todoController");
const auth = require("../middlewares/auth/authMiddleware");
/*
8. Реализовать энд - поинт создания карточки
9. Реализовать энд-поинт редактирования карточки
10. Реализовать энд-поинт подтверждения выполнения карточки
11. Реализовать энд-поинт удаления карточки
12. Реализовать энд-поинт на получение всех карточек пользователя
*/

router.get("/", function (req, res, next) {
  res.send("Please use /active or  /completed to get respective set of cards.");
});
// router.get("/active", todosController.getActiveTodos);
// router.get("/completed", todosController.getCompletedTodos);

// router.post("/add", todosController.addTodo);
// router.put("/update/:todoId", todosController.updateTodo);
// router.patch("/status/:todoId", todosController.setStatusTodo);
// router.delete("/remove/:todoId", todosController.removeTodo);

router.get("/active", auth, todosController.getActiveTodos);
router.get("/completed", auth, todosController.getCompletedTodos);

router.post("/add", auth, todosController.addTodo);
router.put("/update/:todoId", auth, todosController.updateTodo);
router.patch("/status/:todoId", auth, todosController.setStatusTodo);
router.delete("/remove/:todoId", auth, todosController.removeTodo);

module.exports = router;
