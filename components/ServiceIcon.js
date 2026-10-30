import {
  ShieldCheck, Fingerprint, Search, Users, Landmark, HeartPulse, Scale, GraduationCap, Factory, Store, Building2, User,
} from 'lucide-react';

const icons = {
  shield: ShieldCheck, fingerprint: Fingerprint, search: Search, users: Users,
  landmark: Landmark, heart: HeartPulse, scale: Scale, graduation: GraduationCap,
  factory: Factory, store: Store, building: Building2, user: User,
};

export default function ServiceIcon({ name, ...props }) {
  const Icon = icons[name] ?? ShieldCheck;
  return <Icon {...props} />;
}
