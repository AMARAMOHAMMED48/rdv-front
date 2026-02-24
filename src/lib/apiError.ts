interface Violation {
  propertyPath: string;
  message: string;
}

interface ApiErrorBody {
  violations?: Violation[];
}

export function extractViolations(error: unknown): Record<string, string> {
  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'data' in error.response
  ) {
    const body = (error.response as { data: ApiErrorBody }).data;
    if (body?.violations) {
      return body.violations.reduce<Record<string, string>>((acc, v) => {
        acc[v.propertyPath] = v.message;
        return acc;
      }, {});
    }
  }
  return {};
}
