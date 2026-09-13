/**
 * GoSeat - Bus Ticket Booking UI Kit / budhi design lab
 * Color Design Tokens
 */

export const colors = {
  primary: {
    '0': '#FFF2EC',
    '25': '#FFD6C8',
    '50': '#FFB49B',
    '75': '#FF8358',
    '90': '#FF6A27',
    '100': '#D74301',
    '200': '#A53300',
  },
  secondary: {
    '0': '#EAFBF5',
    '25': '#B8E8D5',
    '50': '#86D5B5',
    '75': '#54C295',
    '90': '#2CB37E',
    '100': '#198C5E',
    '200': '#10593B',
  },
  greyscale: {
    '0': '#FFFFFF',
    '5': '#FAFAFA',
    '15': '#F4F4F4',
    '30': '#EEEEEE',
    '50': '#DDDDDD',
    '75': '#AAAAAA',
    '100': '#404040',
    '150': '#212121',
    '200': '#000000',
  },
  success: {
    '0': '#F5FBF5',
    '10': '#EAF7EA',
    '25': '#ACDFAD',
    '50': '#83CF84',
    '65': '#56BF58',
    '90': '#35AF32',
    '100': '#289023',
    '200': '#093E06',
  },
  error: {
    '0': '#FCF8F8',
    '10': '#FAECEB',
    '25': '#E8B0B0',
    '50': '#E09595',
    '65': '#D87272',
    '90': '#CC4F4F',
    '100': '#9A2D2D',
    '200': '#6B1B1B',
  },
  warning: {
    '0': '#FEFBF4',
    '10': '#FDF8E9',
    '25': '#F9E2A8',
    '50': '#F6D47D',
    '65': '#F3C551',
    '90': '#F0B726',
    '100': '#BA8900',
    '200': '#332702',
  },
};

export type PrimaryColorScale = keyof typeof colors.primary;
export type SecondaryColorScale = keyof typeof colors.secondary;
export type GreyscaleColorScale = keyof typeof colors.greyscale;
export type SuccessColorScale = keyof typeof colors.success;
export type ErrorColorScale = keyof typeof colors.error;
export type WarningColorScale = keyof typeof colors.warning;
