/**
 * The Form Builder Component
 *
 * @module aui-form-builder
 */

var CSS_EDIT_LAYOUT_BUTTON = A.getClassName('form', 'builder', 'edit', 'layout', 'button'),
    CSS_EMPTY_COL = A.getClassName('form', 'builder', 'empty', 'col'),
    CSS_EMPTY_COL_ADD_BUTTON = A.getClassName('form', 'builder', 'empty', 'col', 'add', 'button'),
    CSS_EMPTY_COL_ICON = A.getClassName('form', 'builder', 'empty', 'col', 'icon'),
    CSS_EMPTY_COL_LABEL = A.getClassName('form', 'builder', 'empty', 'col', 'label'),
    CSS_EMPTY_LAYOUT = A.getClassName('form', 'builder', 'empty', 'layout'),
    CSS_FIELD = A.getClassName('form', 'builder', 'field'),
    CSS_FIELD_MOVE_TARGET = A.getClassName('form', 'builder', 'field', 'move', 'target'),
    CSS_HEADER = A.getClassName('form', 'builder', 'header'),
    CSS_HEADER_BACK = A.getClassName('form', 'builder', 'header', 'back'),
    CSS_HEADER_TITLE = A.getClassName('form', 'builder', 'header', 'title'),
    CSS_LAYOUT = A.getClassName('form', 'builder', 'layout'),
    CSS_MENU = A.getClassName('form', 'builder', 'menu'),
    CSS_MENU_BUTTON = A.getClassName('form', 'builder', 'menu', 'button'),
    CSS_MENU_CONTENT = A.getClassName('form', 'builder', 'menu', 'content'),
    CSS_PAGE_HEADER = A.getClassName('form', 'builder', 'pages', 'header'),
    CSS_PAGES = A.getClassName('form', 'builder', 'pages'),

    MODES = {
        LAYOUT: 'layout',
        REGULAR: 'regular'
    };

/**
 * A base class for `A.FormBuilder`.
 *
 * @class A.FormBuilder
 * @extends A.Widget
 * @uses A.FormBuilderFieldTypes, A.FormBuilderLayoutBuilder, A.FormBuilderPagesBuilder
 * @param {Object} config Object literal specifying widget configuration
 *     properties.
 * @constructor
 */
A.FormBuilder  = A.Base.create('form-builder', A.Widget, [
    A.FormBuilderFieldTypes,
    A.FormBuilderLayoutBuilder
], {
    TITLE_REGULAR: 'Build your form',

    TPL_EDIT_LAYOUT_BUTTON: '<div class="' + CSS_EDIT_LAYOUT_BUTTON + '">' +
        '<a>Edit Layout</a></div>',
    TPL_EMPTY_COL: '<div class="' + CSS_EMPTY_COL + '">' +
        '<div class="' + CSS_EMPTY_COL_ADD_BUTTON + '" tabindex="9">' +
        '<span class="glyphicon glyphicon-plus ' + CSS_EMPTY_COL_ICON + '"></span>' +
        '<div class="' + CSS_EMPTY_COL_LABEL + '">Add Field</div></div>' +
        '<button class="' + CSS_FIELD_MOVE_TARGET +
        ' layout-builder-move-target layout-builder-move-col-target btn btn-default">' +
        'Paste here</button>' +
        '</div>',
    TPL_HEADER: '<div class="' + CSS_HEADER + '">' +
        '<a class="' + CSS_HEADER_BACK + '" tabindex="1"><span class="glyphicon glyphicon-chevron-left"></span></a>' +
        '<div class="' + CSS_MENU + '">' +
        '<a class="dropdown-toggle ' + CSS_MENU_BUTTON + '" data-toggle="dropdown" tabindex="1">' +
        '<span class="glyphicon glyphicon-cog"></span></a>' +
        '<div class="' + CSS_MENU_CONTENT + ' dropdown-menu dropdown-menu-right"></div></div>' +
        '<div class="' + CSS_HEADER_TITLE + '"></div>' +
        '</div>',
    TPL_LAYOUT: '<div class="' + CSS_LAYOUT + '" ></div>',
    TPL_PAGE_HEADER: '<div class="' + CSS_PAGE_HEADER + '" ></div>',
    TPL_PAGES: '<div class="' + CSS_PAGES + '" ></div>',

    /**
     * Construction logic executed during the `A.FormBuilder`
     * instantiation. Lifecycle.
     *
     * @method initializer
     * @protected
     */
    initializer: function() {
        var contentBox = this.get('contentBox');

        contentBox.append(this.TPL_HEADER);
        contentBox.append(this.TPL_PAGE_HEADER);
        contentBox.append(this.TPL_LAYOUT);
        contentBox.append(this.TPL_PAGES);

        this._fieldToolbar = new A.FormBuilderFieldToolbar(this.get('fieldToolbarConfig'));

        this._eventHandles = [
            this.after('layoutChange', this._afterLayoutChange),
            this.after('layout:rowsChange', this._afterLayoutRowsChange),
            this.after('layout-row:colsChange', this._afterLayoutColsChange),
            this.after('layout-col:valueChange', this._afterLayoutColValueChange)
        ];
    },

    /**
     * Renders the `A.FormBuilder` UI. Lifecycle.
     *
     * @method renderUI
     * @protected
     */
    renderUI: function() {
        this._menuEditLayoutItem = new A.MenuItem({
            content: this.TPL_EDIT_LAYOUT_BUTTON
        });

        this._menu = new A.Menu({
            boundingBox: '.' + CSS_MENU,
            contentBox: '.' + CSS_MENU,
            items: [this._menuEditLayoutItem],
            trigger: '.' + CSS_MENU_BUTTON
        }).render();

        this._pages = new A.FormBuilderPages({
            pageHeader: '.' + CSS_PAGE_HEADER,
            contentBox: '.' + CSS_PAGES,
            pagesQuantity: this.get('layouts').length
        }).render();

        this.get('layouts')[this._getActiveLayoutIndex()].addTarget(this);
    },

    /**
     * Bind the events for the `A.FormBuilder` UI. Lifecycle.
     *
     * @method bindUI
     * @protected
     */
    bindUI: function() {
        var boundingBox = this.get('boundingBox');

        this._eventHandles.push(
            this.get('contentBox').on('focus', A.bind(this._onFocus, this)),
            boundingBox.delegate('click', this._onClickAddField, '.' + CSS_EMPTY_COL_ADD_BUTTON, this),
            boundingBox.delegate('key', A.bind(this._onKeyPressAddField, this), 'enter', '.' + CSS_EMPTY_COL_ADD_BUTTON),
            boundingBox.one('.' + CSS_HEADER_BACK).on('click', this._onClickHeaderBack, this),
            boundingBox.one('.' + CSS_HEADER_BACK).on('key', A.bind(this._onKeyPressHeaderBack, this), 'press:13'),
            this._menu.after('itemSelected', A.bind(this._afterItemSelected, this)),
            A.getDoc().on('key', this._onEscKey, 'esc', this)
        );

        this._pages.on('add', A.bind(this._addLayout, this));
        this._pages.on('remove', A.bind(this._removeLayout, this));
        this._pages.after('activeIndexPageChange', A.bind(this._afterActiveIndexPageChange, this));
    },

    /**
     * Syncs the UI. Lifecycle.
     *
     * @method syncUI
     * @protected
     */
    syncUI: function() {
        this._syncLayoutRows();

        this._updateUniqueFieldType();
    },

    /**
     * Destructor lifecycle implementation for the `A.FormBuilder` class.
     * Lifecycle.
     *
     * @method destructor
     * @protected
     */
    destructor: function() {
        if (this._fieldSettingsModal) {
            this._fieldSettingsModal.destroy();
        }

        (new A.EventHandle(this._eventHandles)).detach();
    },

    /**
     * Adds a nested field to the given field.
     *
     * @method addNestedField
     * @param {A.FormBuilderFieldBase} field
     */
    addNestedField: function (field) {
        this._newFieldContainer = field;
        this.showFieldsPanel();
    },

    /**
     * Opens the settings panel for editing the given field.
     *
     * @method editField
     * @param {A.FormBuilderFieldBase} field
     */
    editField: function (field) {
        var fieldType = this.findTypeOfField(field);
        this.showFieldSettingsPanel(field, fieldType.get('label'));
    },

    /**
     * Returns the `fieldInstance`'s row.
     *
     * @method getFieldRow
     * @param {A.FormField} fieldInstance
     * @return {Node} The row where is the field parameter
     */
    getFieldRow: function(fieldInstance) {
        return fieldInstance.get('content').ancestor('.layout-row');
    },

    /**
     * Removes the given field from the form builder.
     *
     * @method removeField
     * @param {A.FormBuilderFieldBase} field
     */
    removeField: function (field) {
        var col,
            parentField,
            nestedFieldsNode = field.get('content').ancestor('.form-builder-field-nested');

        this._handleRemoveEvent(field);

        if (nestedFieldsNode) {
            parentField = nestedFieldsNode.ancestor('.form-builder-field').getData('field-instance');
            parentField.removeNestedField(field);
            this.get('layouts')[this._getActiveLayoutIndex()].normalizeColsHeight(new A.NodeList(this.getFieldRow(parentField)));
        }
        else {
            col = field.get('content').ancestor('.col').getData('layout-col');
            this._makeColumnEmpty(col);
        }

        this._updateUniqueFieldType();
    },

    /**
     * Shows the settings panel for the given field.
     *
     * @method showFieldSettingsPanel
     * @param {A.FormField} field
     * @param {String} typeName The name of the field type.
     */
    showFieldSettingsPanel: function(field, typeName) {
        if (!this._fieldSettingsModal) {
            this._fieldSettingsModal = new A.FormBuilderSettingsModal();
            this._fieldSettingsModal.after('hide', A.bind(this._afterFieldSettingsModalHide, this));
            this._fieldSettingsModal.after('save', A.bind(this._afterFieldSettingsModalSave, this));
        }

        this._fieldSettingsModal.show(field, typeName);
    },

    /**
     * 
     *
     * @method _addLayout
     * @protected
     */
    _addLayout: function() {
        var newLayout = new A.Layout({
            rows: [
                new A.LayoutRow()
            ]
        });

        this.get('layouts').push(newLayout);
    },

    /**
     * Adds a field into field's nested list and normalizes the columns height.
     *
     * @method _addNestedField
     * @param {A.FormField} field The Field with nested list that will receive the field
     * @param {A.FormField} nested Field to add as nested
     * @param {Number} index The position where the nested field should be added
     * @protected
     */
    _addNestedField: function(field, nested, index) {
        field.addNestedField(index, nested);
        this.get('layouts')[this._getActiveLayoutIndex()].normalizeColsHeight(new A.NodeList(this.getFieldRow(nested)));
    },

    /**
     * Fired when the field settings modal is hidden.
     *
     * @method _afterFieldSettingsModalHide
     * @protected
     */
    _afterFieldSettingsModalHide: function() {
        this._newFieldContainer = null;
    },

    /**
     * Fired when the field settings modal is saved.
     *
     * @method _afterFieldSettingsModalSave
     * @param {EventFacade} event
     * @protected
     */
    _afterFieldSettingsModalSave: function(event) {
        var field = event.field;

        if (this._newFieldContainer) {
            if (A.instanceOf(this._newFieldContainer, A.LayoutCol)) {
                this._newFieldContainer.set('value', field);
            }
            else if (A.instanceOf(this._newFieldContainer, A.FormField)) {
                this._addNestedField(
                    this._newFieldContainer,
                    field,
                    this._newFieldContainer.get('nestedFields').length
                );
            }
            this._newFieldContainer = null;
        }
        else {
            this._handleEditEvent(field);
            this.get('layouts')[this._getActiveLayoutIndex()].normalizeColsHeight(new A.NodeList(field.get('content').ancestor('.layout-row')));
        }

        this._handleCreateEvent(field);
        this.disableUniqueFieldType(field);
    },

    /**
     * Fired after the `itemSelected` event is triggered for the form builder's
     * menu.
     *
     * @method _afterItemSelected
     * @param {EventFacade} event
     * @protected
     */
    _afterItemSelected: function(event) {
        if (event.item === this._menuEditLayoutItem) {
            this.set('mode', A.FormBuilder.MODES.LAYOUT);
        }
    },

    /**
     * Fired after the `layout` attribute is set.
     *
     * @method _afterLayoutChange
     * @param {EventFacade} event
     * @protected
     */
    _afterLayoutChange: function(event) {
        this._syncLayoutRows();

        event.prevVal.removeTarget(this);
        event.newVal.addTarget(this);

        this._updateUniqueFieldType();
    },

    /**
     * Fired after the `layout-row:colsChange` event is triggered.
     *
     * @method _afterLayoutColsChange
     * @protected
     */
    _afterLayoutColsChange: function() {
        this._renderEmptyColumns();

        this._updateUniqueFieldType();
    },

    /**
     * Fired after the `layout-col:valueChange` event is triggered.
     *
     * @method _afterLayoutColValueChange
     * @param {EventFacade} event
     * @protected
     */
    _afterLayoutColValueChange: function(event) {
        var col = event.target;

        if (A.instanceOf(event.newVal, A.FormField)) {
            col.set('movableContent', true);
        }
        else if (!event.newVal) {
            this._makeColumnEmpty(col);
        }
        else {
            col.set('movableContent', false);
        }
    },

    /**
     * Fired after the `layout:rowsChange` event is triggered.
     *
     * @method _afterLayoutRowsChange
     * @protected
     */
    _afterLayoutRowsChange: function() {
        this._syncLayoutRows();

        this._updateUniqueFieldType();
    },

    /**
     * Fire event of create a field.
     *
     * @method _getActiveLayoutIndex
     * @param {A.FormBuilderFieldBase} field
     * @protected
     */
    _getActiveLayoutIndex: function() {
        return this._pages.get('activeIndexPage');
    },

    /**
     * Fire event of create a field.
     *
     * @method _handleCreateEvent
     * @param {A.FormBuilderFieldBase} field
     * @protected
     */
    _handleCreateEvent: function(field) {
        this.fire('create', {
            field: field
        });
    },

    /**
     * Fire event of edit a field.
     *
     * @method _handleEditEvent
     * @param {A.FormBuilderFieldBase} field
     * @protected
     */
    _handleEditEvent: function(field) {
        this.fire('edit', {
            field: field
        });
    },

    /**
     * Fire event of remove a field.
     *
     * @method _handleRemoveEvent
     * @param {A.FormBuilderFieldBase} field
     * @protected
     */
    _handleRemoveEvent: function(field) {
        this.fire('remove', {
            field: field
        });
    },

    /**
     *
     *
     * @method _afterActiveIndexPageChange
     * @protected
     */
    _afterActiveIndexPageChange: function(event) {
        var activeLayout = this.get('layouts')[event.newVal];

        this._layoutBuilder.get('layout').removeTarget(this);
        activeLayout.addTarget(this);
        this._layoutBuilder.set('layout', activeLayout);
        this._syncLayoutRows();
    },

    /**
     * Fires when the esc key is pressed
     *
     * @method _onEscKey
     * @protected
     */
    _onEscKey: function() {
        this._newFieldContainer = null;
    },

    /**
     * Turns the given column into an empty form builder column.
     *
     * @method _makeColumnEmpty
     * @param {A.LayoutCol} col
     * @protected
     */
    _makeColumnEmpty: function(col) {
        col.set('value', { content: this.TPL_EMPTY_COL });
    },

    /**
     * Fired when the button for adding a new field is clicked.
     *
     * @method _onClickAddField
     * @param {EventFacade} event
     * @protected
     */
    _onClickAddField: function(event) {
        this._openNewFieldPanel(event.currentTarget);
    },

    /**
     * Fired when the header back button is clicked.
     *
     * @method _onClickHeaderBack
     * @protected
     */
    _onClickHeaderBack: function() {
        this.set('mode', A.FormBuilder.MODES.REGULAR);
    },

    /**
     * Fired when some node is focused inside content box.
     *
     * @method _onFocus
     * @param {EventFacade} event
     * @protected
     */
    _onFocus: function(event) {
        var fieldContainer,
            target = event.target;

        if (target.hasClass(CSS_FIELD)) {
            fieldContainer = target;
        }
        else {
            fieldContainer = target.ancestor('.' + CSS_FIELD);
        }

        if (fieldContainer) {
            this._fieldToolbar.addForField(fieldContainer.getData('field-instance'));
        }
        else {
            this._fieldToolbar.remove();
        }
    },

    /**
     * Fired when the add field button is pressed.
     *
     * @method _onKeyPressAddField
     * @params {EventFacade} event
     * @protected
     */
    _onKeyPressAddField: function(event) {
        this._openNewFieldPanel(event.currentTarget);
    },

    /**
     * Fired when the header back button is pressed.
     *
     * @method _onKeyPressHeaderBack
     * @protected
     */
    _onKeyPressHeaderBack: function() {
        this.set('mode', A.FormBuilder.MODES.REGULAR);
    },

    /**
     * Opens a panel to select a new field type.
     *
     * @method _openNewFieldPanel
     * @param {Node} target
     * @protected
     */
    _openNewFieldPanel: function(target) {
        this._newFieldContainer = target.ancestor('.col').getData('layout-col');

        this.showFieldsPanel();
    },

    /**
     * 
     *
     * @method _removeLayout
     * @protected
     */
    _removeLayout: function(event) {
        var layout = this.get('layouts');

        layout[event.removedIndex].destroy();
        layout.splice(event.removedIndex, 1);
    },

    /**
     * Renders some content inside the empty columns of the current layout.
     *
     * @method _renderEmptyColumns
     * @protected
     */
    _renderEmptyColumns: function() {
        var instance = this,
            rows = this.get('layouts')[this._getActiveLayoutIndex()].get('rows');

        A.Array.each(rows, function(row) {
            A.Array.each(row.get('cols'), function(col) {
                if (!col.get('value')) {
                    instance._makeColumnEmpty(col);
                }
            });
        });
    },

    /**
     * Sets the `fieldToolbar` attribute.
     *
     * @method _setFieldToolbarConfig
     * @return {Object}
     */
    _setFieldToolbarConfig: function(val) {
        return A.merge({
            formBuilder: this
        }, val);
    },

    /**
     * Sets the `layout` attribute.
     *
     * @method _setLayout
     * @param {A.Layout} val
     * @protected
     */
    _setLayout: function(val) {
        var firstRow;

        if (!A.instanceOf(val, A.Layout)) {
            val = new A.Layout(val);
        }

        if (val.get('rows').length > 0) {
            firstRow = val.get('rows')[0];
        }

        return val;
    },

    /**
     * Syncs the UI according to changes in the layout's rows.
     *
     * @method _syncLayoutRows
     * @protected
     */
    _syncLayoutRows: function() {
        var layout = this.get('layouts')[this._getActiveLayoutIndex()];

        this._renderEmptyColumns();
    },

    /**
     * Updates the form builder header's title.
     *
     * @method _updateHeaderTitle
     * @param {String} title
     * @protected
     */
    _updateHeaderTitle: function(title) {
        var titleNode = this.get('contentBox').one('.' + CSS_HEADER_TITLE);

        titleNode.set('text', title);
    }
}, {

    /**
     * Static property used to define the default attribute
     * configuration for the `A.FormBuilder`.
     *
     * @property ATTRS
     * @type Object
     * @static
     */
    ATTRS: {
        /**
         * A configuration object for the creation of the `A.FormBuilderFieldToolbar`
         * instance to be used for the form builder field toolbars.
         *
         * @attribute fieldToolbarConfig
         * @type Object
         */
        fieldToolbarConfig: {
            setter: '_setFieldToolbarConfig',
            validator: A.Lang.isObject,
            value: {}
        },

        /**
         * The layout where the form fields will be rendered.
         *
         * @attribute layout
         * @type Array
         */
        layouts: {
            value: []
        },

        /**
         * The form builder's current mode. Valid values are the ones listed on
         * `A.FormBuilder.MODES`.
         *
         * @attribute mode
         * @default 'regular'
         * @type String
         */
        mode: {
            validator: function(val) {
                return A.Object.hasValue(MODES, val);
            },
            value: MODES.REGULAR
        }
    },

    /**
     * Static property provides a string to identify the CSS prefix.
     *
     * @property CSS_PREFIX
     * @type String
     * @static
     */
    CSS_PREFIX: A.getClassName('form-builder'),

    /**
     * Static property used to define the valid `A.FormBuilder` modes.
     *
     * @property MODES
     * @type Object
     * @static
     */
    MODES: MODES
});
