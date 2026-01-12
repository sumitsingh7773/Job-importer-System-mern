function normalizeJob(item, source) {
  let externalId = '';

  if (item.guid) {
    if (typeof item.guid === 'object' && '_' in item.guid) {
      externalId = String(item.guid._);
    } else {
      externalId = String(item.guid);
    }
  } else if (item.link) {
    externalId = String(item.link);
  } else {
    externalId = 'no-id-' + Math.random().toString(36).substring(2, 10); 
  }

  return {
    externalId,
    title: item.title || '',
    company: item['job:company'] || '',
    location: item['job:location'] || '',
    description: item.description || '',
    source,
  };
}

module.exports = normalizeJob;
