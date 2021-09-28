import moment from 'moment';

export default () => {
  moment.updateLocale('en', {
    relativeTime: {
      future: 'in %s',
      past: '%s ago',
      s:  'a few seconds',
      ss: '%ss',
      m:  '1m',
      mm: '%dm',
      h:  '1h',
      hh: '%dh',
      d:  '1d',
      dd: '%dd',
      M:  '1M',
      MM: '%dM',
      y:  '1Y',
      yy: '%dY'
    }
  });
}