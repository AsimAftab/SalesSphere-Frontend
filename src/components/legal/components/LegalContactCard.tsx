import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import type { ContactInfo } from '../LegalPageLayout.types';

interface Props {
  title: string;
  contacts: ContactInfo[];
  note?: string;
  responseTime?: string;
}

const iconMap = {
  email: Mail,
  phone: Phone,
  address: MapPin,
} as const;

const LegalContactCard: React.FC<Props> = ({
  title,
  contacts,
  note,
  responseTime,
}) => (
  <div className="bg-gray-50/80 border border-gray-200 rounded-xl p-6 mt-2">
    <h3 className="text-base font-bold text-gray-900 mb-5">{title}</h3>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {contacts.map((c, i) => {
        const Icon = iconMap[c.type];
        return (
          <div
            key={i}
            className="flex items-start gap-3 bg-white rounded-lg border border-gray-100 px-4 py-3.5"
          >
            <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon className="w-4 h-4 text-secondary" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                {c.label}
              </p>
              {c.href ? (
                <a
                  href={c.href}
                  className="text-sm font-medium text-gray-800 hover:text-secondary transition-colors break-all"
                  {...(c.type === 'address'
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  {c.value}
                </a>
              ) : (
                <p className="text-sm text-gray-700 font-medium whitespace-pre-line leading-relaxed">
                  {c.value}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>

    {(note || responseTime) && (
      <div className="mt-5 pt-4 border-t border-gray-200 space-y-1.5">
        {note && (
          <p className="text-[13px] text-gray-500 italic">{note}</p>
        )}
        {responseTime && (
          <p className="text-[13px] text-gray-500">
            <span className="font-semibold text-gray-600">Response Time:</span>{' '}
            {responseTime}
          </p>
        )}
      </div>
    )}
  </div>
);

export default LegalContactCard;
