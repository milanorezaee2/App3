import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';

/**
 * Bespoke profile mark: a gradient medallion with a refined bust silhouette
 * and a small spark badge, replacing the generic outlined "user" glyph.
 */
/**
 * `registered` switches the medallion from forest green to a warm terracotta
 * and turns the badge into a check mark, so a signed-up learner can tell at a
 * glance from the home header.
 */
export function ProfileIcon({ size = 26, badge = true, registered = false }: { size?: number; badge?: boolean; registered?: boolean }) {
  const medallionStart = registered ? '#D08A5F' : '#4D7A57';
  const medallionEnd = registered ? '#9A4B1E' : '#2A4733';
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Defs>
        <LinearGradient id="profileMedallion" x1="8" y1="6" x2="40" y2="42" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={medallionStart} />
          <Stop offset="1" stopColor={medallionEnd} />
        </LinearGradient>
        <LinearGradient id="profileShine" x1="12" y1="8" x2="36" y2="30" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.28" />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient id="profileBadge" x1="30" y1="28" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#E5B35A" />
          <Stop offset="1" stopColor="#B8892B" />
        </LinearGradient>
      </Defs>

      {/* Medallion */}
      <Circle cx="24" cy="24" r="21" fill="url(#profileMedallion)" />
      <Circle cx="24" cy="24" r="21" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="1.5" />
      <Circle cx="24" cy="24" r="17.5" stroke="#FFFFFF" strokeOpacity="0.18" strokeWidth="1" />
      <Path d="M8 20C10 11 17 6 25 6c6 0 10 2 13 5-5-2-12-2-18 1-6 3-9 7-12 8z" fill="url(#profileShine)" />

      {/* Head */}
      <Circle cx="24" cy="18.5" r="6.2" fill="#FFFCF6" />
      {/* Shoulders (clipped by the medallion edge visually via the arc) */}
      <Path d="M11.5 36.5c1.5-6.6 6.5-10.3 12.5-10.3s11 3.7 12.5 10.3c-3.3 3.3-7.7 5.3-12.5 5.3s-9.2-2-12.5-5.3z" fill="#FFFCF6" />
      <Path d="M24 26.2c-2.3 0-4.4.5-6.2 1.5 1.6 1.2 3.7 1.9 6.2 1.9s4.6-.7 6.2-1.9c-1.8-1-3.9-1.5-6.2-1.5z" fill="#D7DECE" />

      {/* Badge */}
      {badge && (
        <>
          <Circle cx="36.5" cy="35.5" r="7.2" fill="#FFFCF6" />
          <Circle cx="36.5" cy="35.5" r="5.6" fill={registered ? "#2F6B45" : "url(#profileBadge)"} />
          {registered
            ? <Path d="M33.4 35.6l2.2 2.2 4.3-4.6" stroke="#FFFCF6" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            : <Path d="M36.5 31.6l1.1 2.5 2.6.3-1.9 1.8.5 2.6-2.3-1.3-2.3 1.3.5-2.6-1.9-1.8 2.6-.3z" fill="#FFFCF6" />}
        </>
      )}
    </Svg>
  );
}
