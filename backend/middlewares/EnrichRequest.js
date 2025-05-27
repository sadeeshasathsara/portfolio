import useragent from 'express-useragent';
import geoip from 'geoip-lite';
import requestIp from 'request-ip';

export const enrichRequest = (req, res, next) => {
    // Get IP
    const ip = requestIp.getClientIp(req) || req.ip || req.connection.remoteAddress;

    // Get location
    const geo = geoip.lookup(ip) || {};

    // Get browser/device
    const ua = useragent.parse(req.headers['user-agent']);

    req.trackingData = {
        ip,
        location: `${geo.city || 'Unknown'}, ${geo.country || 'Unknown'}`,
        browser: `${ua.browser} ${ua.version}`,
        device: ua.isMobile ? 'Mobile' : ua.isTablet ? 'Tablet' : 'Desktop',
    };

    next();
};
