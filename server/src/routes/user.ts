import {Router} from "express";
import {getUserData,deleteUser, createUser,updateUser} from "../controller/user";

const router = Router();

router.get("/",getUserData);
router.delete('/:id',deleteUser);
router.post('/',createUser);
router.put('/:id',updateUser)

export default router;