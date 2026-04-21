/**
 * @fileoverview test
 * @author kaidarka
 */
"use strict";

const { isPathRelative } = require("../helpers");
const micromatch = require("micromatch");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const checkLayers = {
  'entities': 'entities',
  'features': 'features',
  'pages': 'pages',
  'widgets': 'widgets',
};

const PUBLIC_ERROR = "PUBLIC_ERROR";
const PUBLIC_ERROR_IN_TESTING = "PUBLIC_ERROR_IN_TESTING";

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  PUBLIC_ERROR,
  PUBLIC_ERROR_IN_TESTING,
  meta: {
    type: "problem", // `problem`, `suggestion`, or `layout`
    docs: {
      description: "test",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: 'code', // Or `code` or `whitespace`
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string',
            description: 'Alias for the path',
          },
          testFilesPatterns: {
            type: 'array',
            description: 'Patterns for testing files',
          },
        },
      }
    ],
    defaultOptions: [{ alias: '', testFilesPatterns: [] }], // Add a schema if the rule has options
    messages: {
      [PUBLIC_ERROR]: "Абсолютный импорт разрешен только из публичного API",
      [PUBLIC_ERROR_IN_TESTING]: "Абсолютный импорт разрешен только из публичного API в файлах тестирования",
    }, // Add messageId and message
  },
  create(context) {
    const { alias, testFilesPatterns } = context.options[0] ?? {};

    return {
      ImportDeclaration(node) {
        const source = node.source.value;
        const normalizedSource = alias ? source.replace(`${alias}/`, "") : source;
        
        if (isPathRelative(normalizedSource)) {
          return;
        }

        const segments = normalizedSource.split("/");
        const layer = segments[0];
        const slice = segments[1];
        
        if (!checkLayers[layer]) {
          return;
        }
      
        // Дальнейшие значения подобраны под меня, так как выявил для себя удобство группировать фичи и виджеты.
        // Например фича может располагаться в features/Articles/articleRating. 
        // В таком случае это может пропустить некотрые импорты вне публичного API, 
        // но вероятность обращения напрямую к какому либо файлу в корне слайса минимальна, засчет сути архитектурного подхода.
        const isImportNotFromPublicApi = segments.length > 3;
        const testingSegmentIndex = segments.indexOf('testing');
        const isTestingPublicApi = (
          testingSegmentIndex !== -1 &&
          testingSegmentIndex === segments.length - 1 &&
          (testingSegmentIndex === 2 || testingSegmentIndex === 3)
        );

        if (isImportNotFromPublicApi && !isTestingPublicApi) {
          context.report({
            node, 
            messageId: PUBLIC_ERROR,
            fix: (fixer) => {
              return fixer.replaceText(node.source, `'${alias ? `${alias}/` : ''}${layer}/${slice}'`);
            }
          });
        }

        if (isTestingPublicApi) {
          const currentFile = context.filename;

          const isCurrentFileTesting = testFilesPatterns.some(pattern => micromatch.isMatch(currentFile, pattern));

          if (!isCurrentFileTesting) {
            context.report({
              node, 
              messageId: PUBLIC_ERROR_IN_TESTING
            });
          }

        }
      },
    };
  },
};
