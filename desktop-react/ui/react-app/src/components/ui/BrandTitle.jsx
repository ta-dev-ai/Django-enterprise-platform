import { SITE_BRAND } from '../../constants/siteBrand';

export default function BrandTitle({ as: Tag = 'h2', className = 'contact-brand-title' }) {
  return (
    <Tag className={className}>
      Data<span className="brand-accent">Pilot</span>
    </Tag>
  );
}

export function brandPageTitle(suffix) {
  return suffix ? `${suffix} — ${SITE_BRAND.productName}` : SITE_BRAND.productName;
}
