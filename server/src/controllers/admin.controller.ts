import { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { adminService } from '../services/admin.service';
import { sendSuccess } from '../utils/response';
const q=(value:unknown)=>typeof value==='string'&&value.trim()?value.trim():undefined;
const bool=(value:unknown)=>value===true||value==='true';
export const adminController={
 async overview(_req:AuthenticatedRequest,res:Response,next:NextFunction){try{return sendSuccess(res,await adminService.getOverview(),'Admin overview loaded')}catch(error){return next(error)}},
 async users(req:AuthenticatedRequest,res:Response,next:NextFunction){try{return sendSuccess(res,await adminService.users(q(req.query.search)),'Users loaded')}catch(error){return next(error)}},
 async updateUser(req:AuthenticatedRequest,res:Response,next:NextFunction){try{const data=await adminService.updateUser(req.params.id,{role:q(req.body?.role),...(req.body?.isActive!==undefined?{isActive:bool(req.body.isActive)}:{})},req.user?.userId);return sendSuccess(res,data,'User updated')}catch(error){return next(error)}},
 async doctors(req:AuthenticatedRequest,res:Response,next:NextFunction){try{return sendSuccess(res,await adminService.doctors(q(req.query.search)),'Doctors loaded')}catch(error){return next(error)}},
 async updateDoctor(req:AuthenticatedRequest,res:Response,next:NextFunction){try{return sendSuccess(res,await adminService.updateDoctor(req.params.id,bool(req.body?.isActive)),'Doctor updated')}catch(error){return next(error)}},
 async patients(req:AuthenticatedRequest,res:Response,next:NextFunction){try{return sendSuccess(res,await adminService.patients(q(req.query.search)),'Patients loaded')}catch(error){return next(error)}},
 async hospitals(req:AuthenticatedRequest,res:Response,next:NextFunction){try{return sendSuccess(res,await adminService.hospitals(q(req.query.search)),'Hospitals loaded')}catch(error){return next(error)}},
 async updateHospital(req:AuthenticatedRequest,res:Response,next:NextFunction){try{return sendSuccess(res,await adminService.updateHospital(req.params.id,bool(req.body?.isActive)),'Hospital updated')}catch(error){return next(error)}},
 async operations(req:AuthenticatedRequest,res:Response,next:NextFunction){try{return sendSuccess(res,await adminService.operations({search:q(req.query.search),status:q(req.query.status)}),'Operations loaded')}catch(error){return next(error)}},
 async analytics(_req:AuthenticatedRequest,res:Response,next:NextFunction){try{return sendSuccess(res,await adminService.analytics(),'Analytics loaded')}catch(error){return next(error)}},
 async auditLogs(_req:AuthenticatedRequest,res:Response,next:NextFunction){try{return sendSuccess(res,await adminService.auditLogs(),'Audit logs loaded')}catch(error){return next(error)}},
};
