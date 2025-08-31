// src/hooks/useConverter.js - Custom hook for format conversion logic
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { XMLBuilder } from 'fast-xml-parser';
import * as yaml from 'js-yaml';
import { setContent, setDataValid, setError } from '../store/converterSlice';

export const useConverter = () => {
  const dispatch = useDispatch();

  const xmlBuilder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text',
    format: true,
    indentBy: '  ',
  });

  const xmlToJson = useCallback((xml) => {
    let result = {};
    
    if (xml.nodeType === 1) {
      if (xml.attributes && xml.attributes.length > 0) {
        for (let i = 0; i < xml.attributes.length; i++) {
          const attr = xml.attributes[i];
          result[attr.name] = attr.value;
        }
      }
      
      if (xml.hasChildNodes()) {
        for (let i = 0; i < xml.childNodes.length; i++) {
          const item = xml.childNodes[i];
          const nodeName = item.nodeName;
          
          if (item.nodeType === 1) {
            if (result[nodeName] === undefined) {
              result[nodeName] = xmlToJson(item);
            } else {
              if (result[nodeName].push === undefined) {
                const old = result[nodeName];
                result[nodeName] = [];
                result[nodeName].push(old);
              }
              result[nodeName].push(xmlToJson(item));
            }
          } else if (item.nodeType === 3) {
            const text = item.nodeValue.trim();
            if (text) {
              if (!isNaN(text) && text !== '') {
                return text.includes('.') ? parseFloat(text) : parseInt(text);
              } else if (text === 'true' || text === 'false') {
                return text === 'true';
              } else if (text === 'null') {
                return null;
              }
              return text;
            }
          }
        }
      }
    } else if (xml.nodeType === 3) {
      const text = xml.nodeValue.trim();
      if (text) {
        return text;
      }
    }
    
    return result;
  }, []);

  const convertFromXml = useCallback((xmlContent) => {
    try {
      if (!xmlContent.trim()) {
        dispatch(setContent({ format: 'json', content: '' }));
        dispatch(setContent({ format: 'yaml', content: '' }));
        dispatch(setDataValid(false));
        dispatch(setError(null));
        return;
      }

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
      
      if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
        throw new Error('Invalid XML format');
      }

      const jsonObj = xmlToJson(xmlDoc.documentElement);
      const jsonContent = JSON.stringify(jsonObj, null, 2);
      const yamlContent = yaml.dump(jsonObj, { indent: 2, lineWidth: -1 });

      dispatch(setContent({ format: 'json', content: jsonContent }));
      dispatch(setContent({ format: 'yaml', content: yamlContent }));
      dispatch(setDataValid(true));
      dispatch(setError(null));
    } catch (error) {
      dispatch(setError(`Invalid XML format: ${error.message}`));
      dispatch(setContent({ format: 'json', content: '' }));
      dispatch(setContent({ format: 'yaml', content: '' }));
      dispatch(setDataValid(false));
    }
  }, [dispatch, xmlToJson]);

  const convertFromJson = useCallback((jsonContent) => {
    try {
      if (!jsonContent.trim()) {
        dispatch(setContent({ format: 'xml', content: '' }));
        dispatch(setContent({ format: 'yaml', content: '' }));
        dispatch(setDataValid(false));
        dispatch(setError(null));
        return;
      }

      const jsonObj = JSON.parse(jsonContent);
      const xmlContent = xmlBuilder.build(jsonObj);
      const yamlContent = yaml.dump(jsonObj, { indent: 2, lineWidth: -1 });

      dispatch(setContent({ format: 'xml', content: xmlContent }));
      dispatch(setContent({ format: 'yaml', content: yamlContent }));
      dispatch(setDataValid(true));
      dispatch(setError(null));
    } catch (error) {
      dispatch(setError(`Invalid JSON format: ${error.message}`));
      dispatch(setContent({ format: 'xml', content: '' }));
      dispatch(setContent({ format: 'yaml', content: '' }));
      dispatch(setDataValid(false));
    }
  }, [dispatch, xmlBuilder]);

  const convertFromYaml = useCallback((yamlContent) => {
    try {
      if (!yamlContent.trim()) {
        dispatch(setContent({ format: 'xml', content: '' }));
        dispatch(setContent({ format: 'json', content: '' }));
        dispatch(setDataValid(false));
        dispatch(setError(null));
        return;
      }

      const jsonObj = yaml.load(yamlContent);
      const jsonContent = JSON.stringify(jsonObj, null, 2);
      const xmlContent = xmlBuilder.build(jsonObj);

      dispatch(setContent({ format: 'xml', content: xmlContent }));
      dispatch(setContent({ format: 'json', content: jsonContent }));
      dispatch(setDataValid(true));
      dispatch(setError(null));
    } catch (error) {
      dispatch(setError(`Invalid YAML format: ${error.message}`));
      dispatch(setContent({ format: 'xml', content: '' }));
      dispatch(setContent({ format: 'json', content: '' }));
      dispatch(setDataValid(false));
    }
  }, [dispatch, xmlBuilder]);

  const convert = useCallback((format, content) => {
    switch (format) {
      case 'xml':
        convertFromXml(content);
        break;
      case 'json':
        convertFromJson(content);
        break;
      case 'yaml':
        convertFromYaml(content);
        break;
      default:
        break;
    }
  }, [convertFromXml, convertFromJson, convertFromYaml]);

  return { convert };
};