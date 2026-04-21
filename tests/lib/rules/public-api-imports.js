/**
 * @fileoverview test
 * @author kaidarka
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements 
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/public-api-imports"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2015,
    sourceType: "module",
  },
});
ruleTester.run("public-api-imports", rule, {
  valid: [
    {
      code: "import { Article } from 'entities/Article';",
      options: [],
    },
    {
      code: "import { loginByUsername } from 'features/AuthByUsername';",
      options: [],
    },
    {
      code: "import { helper } from '../model/selectors/getArticle';",
      options: [],
    },
    {
      code: "import { StoreProvider } from 'app/providers/StoreProvider';",
      options: [],
    },
    {
      code: "import { Article } from '@/entities/Article';",
      options: [{ alias: "@" }],
    },
    {
      code: "import { ArticleTestData } from 'entities/Article/testing';",
      filename: "/home/user/project/src/entities/Article/model/article.test.js",
      options: [{ testFilesPatterns: ["**/*.test.js", "**/*.spec.js"] }],
    },
    {
      code: "import { ratingModel } from 'features/Articles/articleRating';",
      options: [],
    },
    {
      code: "import { ArticleTestData } from '@/entities/Article/testing';",
      filename: "/home/user/project/src/entities/Article/model/article.spec.js",
      options: [{ alias: "@", testFilesPatterns: ["**/*.test.js", "**/*.spec.js"] }],
    },
    {
      code: "import { profileReducer } from '@/features/Profile/editableProfileCard/testing';",
      filename: "/home/user/Develop/study/study-project/src/shared/config/storyBook/StoreDecorator/StoreDecorator.tsx",
      options: [{ alias: "@", testFilesPatterns: ["**/*.test.js", "**/*.spec.js", "**/StoreDecorator.tsx"] }],
    },
  ],

  invalid: [
    {
      code: "import { getArticleData } from 'entities/Article/model/selectors';",
      errors: [{ messageId: rule.PUBLIC_ERROR }],
      options: [],
      output: "import { getArticleData } from 'entities/Article';",
    },
    {
      code: "import { loginByUsername } from 'features/AuthByUsername/model/services/loginByUsername';",
      errors: [{ messageId: rule.PUBLIC_ERROR }],
      options: [],
      output: "import { loginByUsername } from 'features/AuthByUsername';",
    },
    {
      code: "import { getArticleData } from '@/entities/Article/model/selectors';",
      errors: [{ messageId: rule.PUBLIC_ERROR }],
      options: [{ alias: "@" }],
      output: "import { getArticleData } from '@/entities/Article';",
    },
    {
      code: "import { ArticleTestData } from 'entities/Article/testing';",
      filename: "/home/user/project/src/entities/Article/model/article.js",
      errors: [{ messageId: rule.PUBLIC_ERROR_IN_TESTING }],
      options: [{ testFilesPatterns: ["**/*.test.js", "**/*.spec.js"] }],
      output: null,
    },
    {
      code: "import { ArticleTestData } from '@/entities/Article/testing';",
      filename: "/home/user/project/src/entities/Article/model/article.js",
      errors: [{ messageId: rule.PUBLIC_ERROR_IN_TESTING }],
      options: [{ alias: "@", testFilesPatterns: ["**/*.test.js", "**/*.spec.js"] }],
      output: null,
    },
    {
      code: "import { articleMock } from 'entities/Article/testing/mocks/article';",
      filename: "/home/user/project/src/entities/Article/model/article.test.js",
      errors: [{ messageId: rule.PUBLIC_ERROR }],
      options: [{ testFilesPatterns: ["**/*.test.js", "**/*.spec.js"] }],
      output: "import { articleMock } from 'entities/Article';",
    },
  ],
});
