"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const prisma_1 = require("../utils/prisma");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.authMiddleware, async (_req, res, next) => {
    try {
        const data = await prisma_1.prisma.governorate.findMany({
            where: { isActive: true },
            orderBy: { nameEn: 'asc' },
        });
        return res.json({ success: true, data });
    }
    catch (error) {
        return next(error);
    }
});
exports.default = router;
//# sourceMappingURL=governorate.routes.js.map