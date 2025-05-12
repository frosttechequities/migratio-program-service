import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Skeleton } from '@mui/material';

/**
 * ResponsiveImage component that handles different image sizes and formats
 * with lazy loading and fallback support
 *
 * @param {Object} props - Component props
 * @param {string} props.src - Main image source
 * @param {string} props.mobileSrc - Mobile-optimized image source
 * @param {string} props.webpSrc - WebP format image source
 * @param {string} props.mobileWebpSrc - Mobile-optimized WebP format image source
 * @param {string} props.alt - Image alt text
 * @param {Object} props.sx - Additional styles for the container
 * @param {Object} props.imgSx - Additional styles for the image
 * @param {boolean} props.lazy - Whether to use lazy loading
 * @param {string} props.objectFit - Object-fit property for the image
 * @param {string} props.objectPosition - Object-position property for the image
 * @param {function} props.onLoad - Callback when image is loaded
 * @returns {React.ReactElement} ResponsiveImage component
 */
const ResponsiveImage = ({
  src,
  mobileSrc,
  webpSrc,
  mobileWebpSrc,
  alt,
  sx = {},
  imgSx = {},
  lazy = true,
  objectFit = 'cover',
  objectPosition = 'center',
  onLoad,
  threshold = 0.1,
  rootMargin = '50px',
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(!lazy);
  const imageRef = useRef(null);

  // Set up intersection observer for lazy loading
  useEffect(() => {
    if (!lazy) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        observer.disconnect();
      }
    };
  }, [lazy, threshold, rootMargin]);

  const handleLoad = () => {
    setLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setError(true);
  };

  // Default image styles
  const defaultImgStyles = {
    width: '100%',
    height: '100%',
    objectFit,
    objectPosition,
    display: loaded ? 'block' : 'none',
  };

  // Combined image styles
  const combinedImgStyles = { ...defaultImgStyles, ...imgSx };

  return (
    <Box
      ref={imageRef}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        ...sx,
      }}
    >
      {!loaded && (
        <Skeleton
          variant="rectangular"
          animation="wave"
          width="100%"
          height="100%"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            borderRadius: sx.borderRadius || 0,
          }}
        />
      )}

      {!error ? (
        shouldLoad && (
          <picture>
            {/* Mobile WebP */}
            {mobileWebpSrc && (
              <source
                media="(max-width: 767px)"
                srcSet={mobileWebpSrc}
                type="image/webp"
              />
            )}

            {/* Desktop WebP */}
            {webpSrc && (
              <source srcSet={webpSrc} type="image/webp" />
            )}

            {/* Mobile fallback */}
            {mobileSrc && (
              <source
                media="(max-width: 767px)"
                srcSet={mobileSrc}
              />
            )}

            {/* Desktop fallback */}
            <img
              src={src}
              alt={alt}
              loading={lazy ? 'lazy' : 'eager'}
              onLoad={handleLoad}
              onError={handleError}
              style={combinedImgStyles}
              width={imgSx.width}
              height={imgSx.height}
              decoding="async"
            />
          </picture>
        )
      ) : (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(0, 0, 0, 0.05)',
            color: 'text.secondary',
            fontSize: '0.875rem',
            borderRadius: sx.borderRadius || 0,
          }}
        >
          {alt || 'Image not available'}
        </Box>
      )}
    </Box>
  );
};

ResponsiveImage.propTypes = {
  src: PropTypes.string.isRequired,
  mobileSrc: PropTypes.string,
  webpSrc: PropTypes.string,
  mobileWebpSrc: PropTypes.string,
  alt: PropTypes.string.isRequired,
  sx: PropTypes.object,
  imgSx: PropTypes.object,
  lazy: PropTypes.bool,
  objectFit: PropTypes.string,
  objectPosition: PropTypes.string,
  onLoad: PropTypes.func,
  threshold: PropTypes.number,
  rootMargin: PropTypes.string,
};

export default ResponsiveImage;
