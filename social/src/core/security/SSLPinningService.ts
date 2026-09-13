/**
 * Production-Grade SSL & Public Key Pinning (HPKP / SPKI) Manager
 * Validates SHA-256 certificate hashes and prevents Man-in-the-Middle (MitM) attacks.
 */

export interface SSLPinConfig {
  domain: string;
  pins: string[]; // SHA-256 public key / certificate hashes
  includeSubdomains?: boolean;
  enforceExpirationDate?: string;
}

export class SSLPinningService {
  // Certified Public Key Pin Set for SocialSphere Infrastructure
  private pinConfigs: Map<string, SSLPinConfig> = new Map([
    [
      'api.socialsphere.enterprise',
      {
        domain: 'api.socialsphere.enterprise',
        pins: [
          'sha256/k20YWjR6T/E2s5fU9xM5+5J8o+G/Z6lJ6i8k9lM4nO0=', // Primary Leaf
          'sha256/r/m5EMQvJAu8m0pQ2SUcxgkMBTX9hhLkFiOio4G+oK0=', // Backup Intermediate
          'sha256/WoiWRyIOVNa9ihaapV5X6MMK4jGlNJUd//CME/M29yc=', // DigiCert Global Root G2
        ],
        includeSubdomains: true,
      },
    ],
    [
      'cdn.socialsphere.enterprise',
      {
        domain: 'cdn.socialsphere.enterprise',
        pins: [
          'sha256/k20YWjR6T/E2s5fU9xM5+5J8o+G/Z6lJ6i8k9lM4nO0=',
          'sha256/r/m5EMQvJAu8m0pQ2SUcxgkMBTX9hhLkFiOio4G+oK0=',
        ],
        includeSubdomains: true,
      },
    ],
    [
      'media.socialsphere.enterprise',
      {
        domain: 'media.socialsphere.enterprise',
        pins: [
          'sha256/k20YWjR6T/E2s5fU9xM5+5J8o+G/Z6lJ6i8k9lM4nO0=',
        ],
        includeSubdomains: true,
      },
    ],
  ]);

  private isPinningEnabled = true;

  public setPinningEnabled(enabled: boolean): void {
    this.isPinningEnabled = enabled;
  }

  public getPinsForUrl(url: string): string[] {
    try {
      const hostname = this.extractHostname(url);
      if (!hostname) return [];

      const exact = this.pinConfigs.get(hostname);
      if (exact) return exact.pins;

      // Check wildcard/subdomain matches
      for (const [domain, config] of this.pinConfigs.entries()) {
        if (config.includeSubdomains && (hostname === domain || hostname.endsWith(`.${domain}`))) {
          return config.pins;
        }
      }

      return [];
    } catch {
      return [];
    }
  }

  /**
   * Validate TLS certificate SHA-256 against pinned keys
   */
  public validateCertificate(hostname: string, receivedCertHash: string): boolean {
    if (!this.isPinningEnabled) return true;

    const pins = this.getPinsForUrl(hostname);
    if (pins.length === 0) {
      // Not a pinned domain (e.g. external third-party avatar/media)
      return true;
    }

    const isValid = pins.some(
      (pinnedHash) => pinnedHash.toLowerCase() === receivedCertHash.toLowerCase()
    );

    if (!isValid) {
      console.error(
        `[SSLPinningService] 🚨 CRITICAL: SSL Pinning validation failed for ${hostname}! Possible MitM attack detected.`
      );
    }

    return isValid;
  }

  private extractHostname(url: string): string {
    const match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n?]+)/im);
    return match ? match[1] : url;
  }
}

export const sslPinningService = new SSLPinningService();
