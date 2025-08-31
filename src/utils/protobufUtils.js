export const inferProtobufType = (value, fieldName) => {
  if (value === null || value === undefined) {
    return 'string'; // Default to optional string
  }
  
  if (typeof value === 'string') {
    return 'string';
  }
  
  if (typeof value === 'boolean') {
    return 'bool';
  }
  
  if (typeof value === 'number') {
    if (Number.isInteger(value)) {
      if (value >= -2147483648 && value <= 2147483647) {
        return 'int32';
      } else {
        return 'int64';
      }
    } else {
      return 'double';
    }
  }
  
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return 'repeated string'; // Default for empty arrays
    }
    const firstType = inferProtobufType(value[0]);
    return `repeated ${firstType}`;
  }
  
  if (typeof value === 'object') {
    return fieldName.charAt(0).toUpperCase() + fieldName.slice(1); // Nested message
  }
  
  return 'string';
};

export const generateProtoSchema = (messageName, jsonData, indent = 0) => {
  const spaces = '  '.repeat(indent);
  let proto = '';
  
  if (indent === 0) {
    proto += 'syntax = "proto3";\n\n';
  }
  
  // Handle root-level arrays
  if (Array.isArray(jsonData)) {
    if (jsonData.length === 0) {
      return proto + `${spaces}message ${messageName} {\n${spaces}  // Empty array\n${spaces}}\n`;
    }
    
    const itemName = `${messageName}Item`;
    const firstItem = jsonData[0];
    
    // Generate schema for array item
    const itemSchema = generateProtoSchema(itemName, firstItem, indent);
    
    // Generate wrapper message with repeated field
    const wrapperSchema = `${spaces}message ${messageName} {\n${spaces}  repeated ${itemName} items = 1;\n${spaces}}\n`;
    
    return proto + itemSchema + '\n' + wrapperSchema;
  }
  
  // Handle regular objects (existing logic)
  proto += `${spaces}message ${messageName} {\n`;
  
  let fieldNumber = 1;
  const nestedMessages = [];
  
  for (const [key, value] of Object.entries(jsonData)) {
    const fieldType = inferProtobufType(value, key);
    
    if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
      const nestedMessageName = key.charAt(0).toUpperCase() + key.slice(1);
      proto += `${spaces}  ${nestedMessageName} ${key} = ${fieldNumber};\n`;
      nestedMessages.push({
        name: nestedMessageName,
        data: value
      });
    } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
      const nestedMessageName = key.charAt(0).toUpperCase() + key.slice(1).replace(/s$/, '');
      proto += `${spaces}  repeated ${nestedMessageName} ${key} = ${fieldNumber};\n`;
      nestedMessages.push({
        name: nestedMessageName,
        data: value[0]
      });
    } else {
      proto += `${spaces}  ${fieldType} ${key} = ${fieldNumber};\n`;
    }
    fieldNumber++;
  }
  
  proto += `${spaces}}\n`;
  
  // Add nested messages
  for (const nested of nestedMessages) {
    proto += '\n' + generateProtoSchema(nested.name, nested.data, indent);
  }
  
  return proto;
};

export const calculateSizeComparison = (jsonData, binaryData) => {
  const jsonSize = JSON.stringify(jsonData).length;
  const binarySize = binaryData ? binaryData.length : 0;
  const savings = jsonSize > 0 ? Math.round(((jsonSize - binarySize) / jsonSize) * 100) : 0;
  
  return {
    jsonSize,
    binarySize,
    savings,
  };
};