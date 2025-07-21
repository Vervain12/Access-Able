export const formatAddress = (locationInfo) => {

    const tags = locationInfo.tags;
    const parts = [];

    if (tags['addr:housenumber']) parts.push(tags['addr:housenumber']);
    if (tags['addr:street']) parts.push(tags['addr:street']);
    if (tags['addr:postcode']) parts.push(tags['addr:postcode']);

    if (parts.length == 0) {
        return "No address available"
    }

    return parts.join(' ');
}