interface NpmCheckerResult {
  total_checked: number;
  total_deprecated: number;
  deprecated_packages: Record<string, string>;
  outdated_packages: Record<string, string>;
}
