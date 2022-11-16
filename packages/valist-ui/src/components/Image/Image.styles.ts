import { createStyles, MantineNumberSize } from '@mantine/styles';

export interface ImageStylesParams {
  radius: MantineNumberSize;
}

export default createStyles((theme, { radius }: ImageStylesParams) => ({
  root: {},

  image: {
    ...theme.fn.fontStyles(),
    objectFit: 'contain',
    display: 'block',
    width: '100%',
    height: '100%',
    border: 0,
    borderRadius: theme.fn.size({ size: radius, sizes: theme.radius }),
  },
}));