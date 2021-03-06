module.exports = function ( options ) {
    var console = require( './lib/console' );
    var chalk = require( 'chalk' );
    var extend = require( 'extend' );
    var util = require( 'util' );
    var getTime = require( './lib/get-time' );

    var inspect = function ( arg ) {
        if ( typeof arg !== 'object' && !Array.isArray( arg ) ) {
            return arg;
        }
        return util.inspect( arg, { depth: 3 } );
    };

    var opts = extend( {
        appendTime: true,
        coloredOutput: false,
        format:'HH:mm:ss',
        methods: {
            ok: {
                muteable: false,
                color: 'cyanBright',
                token: ' ✔ '
            },
            subtle: {
                muteable: true,
                color: 'magenta',
                token: ' ➤ '
            },
            error: {
                muteable: false,
                color: 'red',
                token: ' ✘ '
            },
            log: {
                muteable: true,
                color: 'white',
                token: ' ℹ '
            },
            warn: {
                muteable: false,
                color: 'yellow',
                token: ' ⚠ '
            },
            print: {
                muteable: false,
                noAppendTime: true,
                color: 'gray',
                token: null
            },
            success: {
                muteable: false,
                color: 'green',
                token: ' ❤ '
            }
        }
    }, options );

    var defineMethod = function defineMethod( entry, key ) {
        return function logMethod() {
            if ( opts.quiet && entry.muteable ) {
                return;
            }
            var args = [ ].slice.call( arguments );

            if ( opts.appendTime && !entry.noAppendTime ) {
                args.unshift( '[' + getTime(opts.format) + ']' );
            }

            if ( entry.token ) {
                args.unshift( entry.token );
            }

            args = args.map( function ( arg ) {
                return opts.coloredOutput ? chalk[ entry.color ]( inspect( arg ) ) : inspect( arg );
            } );

            var logFn = 'log';

            console[ logFn ].apply( console, args );

        };
    };

    var methods = opts.methods;

    var log = Object.keys( methods ).reduce( function ( seq, key ) {
        seq[ key ] = defineMethod( methods[ key ], key );
        return seq;
    }, { } );

    return log;
};
