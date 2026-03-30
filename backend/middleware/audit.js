const AuditLog = require('../models/AuditLog');

function auditAction(action, entityType) {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res);
    res.json = function (body) {
      const userId = req.user ? req.user.id : null;
      const entityId = req.params.id || (body && body.id) || (body && body.complaintId);
      AuditLog.create({
        userId,
        action,
        entityType,
        entityId,
        details: body ? { statusCode: res.statusCode } : undefined,
        ipAddress: req.ip || req.connection?.remoteAddress,
      }).catch(() => {});
      return originalJson(body);
    };
    next();
  };
}

module.exports = { auditAction };
