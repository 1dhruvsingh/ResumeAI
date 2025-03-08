declare module 'languagetool-api' {
  interface LanguageToolOptions {
    endpoint?: string;
    language?: string;
  }
  
  interface GrammarCheckResult {
    matches: Array<{
      message: string;
      offset: number;
      length: number;
      replacements: Array<{
        value: string;
      }>;
      context: {
        text: string;
        offset: number;
        length: number;
      };
      rule: {
        id: string;
        description: string;
        category: {
          id: string;
          name: string;
        };
      };
    }>;
  }

  class LanguageTool {
    constructor(options?: LanguageToolOptions);
    check(text: string): Promise<GrammarCheckResult>;
  }

  export default LanguageTool;
}
