export const duration = seconds => `${Math.floor((seconds || 0)/3600)}h ${Math.floor(((seconds || 0)%3600)/60)}m`;
