const Attribute = require('../models/attributeModel')
const attributeService = require('../service/attributeService')

const getAttributes = async (req, res) => {
    try {
        const { total } = await attributeService.getAllAttributeService();
        const attributes = await Attribute.find();
        res.status(200).json({ total, attributes });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching attributes', error });
    }
};

module.exports = {
    getAttributes
}