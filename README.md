# Modes

Minimal modal editing extension.

## Features

Just has the bare mininum to enable modal editing in VS Code.  Comes with
a `modes.current` for use in `when` conditionals of key bindings, and
a `Modes: Change Mode` command.

Clicking the mode indicator in the status bar will also allow changing
modes.

The extension comes with two modes configured (`Insert` and `Normal`)
and `ctrl+space` keybindings for toggling between them.  Normal mode
will disable typing while enabled.

## Extension Settings

Add modes to `modes.availableModes` config, each entry looks like this:

```
{
    ...
    "mode-key": {
        "kind": "normal"|"insert",
        "label": "Mode name for humans"
    }
    ...
}
```

Modes with `kind=normal` prevent typing in an editor.  In such modes keys
or key sequences are meant to be used in key bindings instead of directly
editing the text.

A default mode (the one enabled on startup) can be set via the
`modes.defaultMode` config, which should be set to the key of
and existing mode.